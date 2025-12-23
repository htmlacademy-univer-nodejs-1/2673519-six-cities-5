import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { StatusCodes } from 'http-status-codes';
import { BaseController, DocumentExistsMiddleware, HttpError, HttpMethod, PrivateRouteMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { IOfferService } from './offer-service.interface.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { IAuthService } from '../../libs/auth/index.js';
import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';

@injectable()
export class FavoritesController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: ILogger,
    @inject(Component.OfferService) private readonly offerService: IOfferService,
    @inject(Component.AuthService) private readonly authService: IAuthService,
  ) {
    super(logger);

    this.logger.info('Register routes for FavoritesController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [new PrivateRouteMiddleware(this.authService)],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(this.authService),
        new ValidateObjectIdMiddleware('offerId'),
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

  private adaptOffer(offer: DocumentType<OfferEntity>, userId: string): unknown {
    const offerObject = offer.toObject();
    const isFavorite = (offer.favoriteUserIds ?? []).some((favoriteUserId) => String(favoriteUserId) === userId);
    return { ...offerObject, isFavorite };
  }

  public async index(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Authorization required.');
    }

    const offers = await this.offerService.getFavourites(userId);
    const adaptedOffers = offers.map((offer) => this.adaptOffer(offer, userId));
    this.ok(res, plainToInstance(OfferRdo, adaptedOffers, { excludeExtraneousValues: true }));
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Authorization required.');
    }
    const updatedOffer = await this.offerService.addToFavourites(offerId, userId);

    if (!updatedOffer) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found.');
    }

    const adaptedOffer = this.adaptOffer(updatedOffer, userId);
    this.created(res, plainToInstance(OfferRdo, adaptedOffer, { excludeExtraneousValues: true }));
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Authorization required.');
    }
    await this.offerService.deleteFromFavourites(offerId, userId);

    this.noContent(res, {});
  }
}
