import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { plainToInstance } from 'class-transformer';
import { BaseController, HttpError, HttpMethod, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { ICommentService } from './comment-service.interface.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { CommentRdo } from './rdo/comment.rdo.js';
import { IOfferService } from '../offer/offer-service.interface.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: ILogger,
    @inject(Component.CommentService) private readonly commentService: ICommentService,
    @inject(Component.OfferService) private readonly offerService: IOfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateObjectIdMiddleware('offerId'), new ValidateDtoMiddleware(CreateCommentDto)],
    });
  }

  public async index(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;

    const existsOffer = await this.offerService.exists(offerId);
    if (!existsOffer) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with id ${offerId} not found.`);
    }

    const comments = await this.commentService.findByOfferId(offerId);
    this.ok(res, plainToInstance(CommentRdo, comments, { excludeExtraneousValues: true }));
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { offerId } = req.params;
    const body = req.body as CreateCommentDto;
    body.offerId = offerId;

    const existsOffer = await this.offerService.exists(offerId);
    if (!existsOffer) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with id ${offerId} not found.`);
    }

    const createdComment = await this.commentService.create(body);
    await this.offerService.calculateRating(offerId);

    this.created(res, plainToInstance(CommentRdo, createdComment, { excludeExtraneousValues: true }));
  }
}
