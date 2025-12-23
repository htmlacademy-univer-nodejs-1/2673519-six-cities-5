import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BaseController, DocumentExistsMiddleware, HttpError, HttpMethod, ParseTokenMiddleware, PrivateRouteMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { City, Component } from '../../types/index.js';
import { IOfferService } from './offer-service.interface.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { OfferPreviewRdo } from './rdo/offer-preview.rdo.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { plainToInstance } from 'class-transformer';
import { IAuthService } from '../../libs/auth/index.js';
import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { ICommentService } from '../comment/comment-service.interface.js';

@injectable()
export default class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: ILogger,
    @inject(Component.OfferService) private readonly offerService: IOfferService,
    @inject(Component.CommentService) private readonly commentService: ICommentService,
    @inject(Component.AuthService) private readonly authService: IAuthService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [new ParseTokenMiddleware(this.authService)],
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new PrivateRouteMiddleware(this.authService), new ValidateDtoMiddleware(CreateOfferDto)],
    });
    this.addRoute({
      path: '/premium/:city',
      method: HttpMethod.Get,
      handler: this.getPremium,
      middlewares: [new ParseTokenMiddleware(this.authService)],
    });
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares: [new PrivateRouteMiddleware(this.authService)],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ParseTokenMiddleware(this.authService),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'offerId', 'Offer')
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(this.authService),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'offerId', 'Offer')
      ],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(this.authService),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'offerId', 'Offer')
      ],
    });
  }

  private adaptOffer(offer: DocumentType<OfferEntity>, userId?: string): unknown {
    const offerObject = offer.toObject();
    const isFavorite = Boolean(
      userId && (offer.favoriteUserIds ?? []).some((favoriteUserId) => String(favoriteUserId) === userId)
    );

    return { ...offerObject, isFavorite };
  }

  private getOwnerId(offer: DocumentType<OfferEntity>): string {
    const owner: unknown = offer.owner;
    if (owner && typeof owner === 'object') {
      const maybeDoc = owner as { _id?: unknown; id?: unknown };
      if (maybeDoc._id) {
        return String(maybeDoc._id);
      }
      if (maybeDoc.id) {
        return String(maybeDoc.id);
      }
    }
    return String(owner);
  }

  private parseLimit(req: Request, defaultLimit: number): number {
    const limitRaw = (req.query as Record<string, unknown> | undefined)?.limit;
    if (typeof limitRaw !== 'string') {
      return defaultLimit;
    }
    const parsed = Number.parseInt(limitRaw, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultLimit;
  }

  public async index(req: Request, res: Response) {
    const limit = this.parseLimit(req, 60);
    const offers = await this.offerService.find(limit);
    const adaptedOffers = offers.map((offer) => this.adaptOffer(offer, req.user?.id));
    this.ok(res, plainToInstance(OfferPreviewRdo, adaptedOffers, { excludeExtraneousValues: true }));
  }

  public async create(req: Request, res: Response): Promise<void> {
    const body = req.body as CreateOfferDto;
    const userId = req.user?.id;
    if (!userId) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Authorization required.');
    }

    const result = await this.offerService.create(body, userId);
    const adaptedOffer = this.adaptOffer(result, userId);
    this.created(res, plainToInstance(OfferRdo, adaptedOffer, { excludeExtraneousValues: true }));
  }

  public async show(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      this.ok(res, null);
      return;
    }

    const adaptedOffer = this.adaptOffer(offer, req.user?.id);
    this.ok(res, plainToInstance(OfferRdo, adaptedOffer, { excludeExtraneousValues: true }));
  }

  public async update(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const body = req.body as UpdateOfferDto;

    const userId = req.user?.id;
    if (!userId) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Authorization required.');
    }

    const offer = await this.offerService.findById(offerId);
    if (!offer) {
      this.ok(res, null);
      return;
    }

    if (this.getOwnerId(offer) !== userId) {
      throw new HttpError(StatusCodes.FORBIDDEN, 'Access denied.');
    }

    const updatedOffer = await this.offerService.updateById(offerId, body);

    if (!updatedOffer) {
      this.ok(res, null);
      return;
    }

    const adaptedOffer = this.adaptOffer(updatedOffer, req.user?.id);
    this.ok(res, plainToInstance(OfferRdo, adaptedOffer, { excludeExtraneousValues: true }));
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;

    const userId = req.user?.id;
    if (!userId) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Authorization required.');
    }

    const offer = await this.offerService.findById(offerId);
    if (!offer) {
      this.noContent(res, {});
      return;
    }

    if (this.getOwnerId(offer) !== userId) {
      throw new HttpError(StatusCodes.FORBIDDEN, 'Access denied.');
    }

    await this.commentService.deleteByOfferId(offerId);
    await this.offerService.deleteById(offerId);

    this.noContent(res, {});
  }

  public async getPremium(req: Request, res: Response): Promise<void> {
    const { city } = req.params;
    const offers = await this.offerService.findPremiumInCity(city as City);
    const adaptedOffers = offers.map((offer) => this.adaptOffer(offer, req.user?.id));
    this.ok(res, plainToInstance(OfferPreviewRdo, adaptedOffers, { excludeExtraneousValues: true }));
  }

  public async getFavorites(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Authorization required.');
    }

    const offers = await this.offerService.getFavourites(userId);
    const adaptedOffers = offers.map((offer) => this.adaptOffer(offer, userId));
    this.ok(res, plainToInstance(OfferPreviewRdo, adaptedOffers, { excludeExtraneousValues: true }));
  }
}
