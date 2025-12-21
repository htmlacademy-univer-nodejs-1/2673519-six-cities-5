import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { plainToInstance } from 'class-transformer';
import { BaseController, HttpError, HttpMethod, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { IOfferService } from './offer-service.interface.js';
import { OfferRdo } from './rdo/offer.rdo.js';

@injectable()
export class FavoritesController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: ILogger,
    @inject(Component.OfferService) private readonly offerService: IOfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for FavoritesController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });
  }

  public async index(req: Request, res: Response): Promise<void> {
    const userId = req.headers.authorization ?? '';
    const offers = await this.offerService.getFavourites(userId);
    this.ok(res, plainToInstance(OfferRdo, offers, { excludeExtraneousValues: true }));
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const userId = req.headers.authorization ?? '';
    const updatedOffer = await this.offerService.addToFavourites(offerId, userId);

    if (!updatedOffer) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with id ${offerId} not found.`);
    }

    this.created(res, plainToInstance(OfferRdo, updatedOffer, { excludeExtraneousValues: true }));
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const userId = req.headers.authorization ?? '';
    const updatedOffer = await this.offerService.deleteFromFavourites(offerId, userId);

    if (!updatedOffer) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with id ${offerId} not found.`);
    }

    this.noContent(res, {});
  }
}
