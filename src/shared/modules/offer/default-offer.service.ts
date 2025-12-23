import { inject, injectable } from 'inversify';
import { IOfferService } from './offer-service.interface.js';
import { City, Component } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { Types } from 'mongoose';

@injectable()
export class DefaultOfferService implements IOfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto, ownerId: string): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create({
      ...dto,
      owner: ownerId,
      favoriteUserIds: [],
    });
    this.logger.info(`New offer created: ${dto.title}`);
    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).populate(['owner']).exec();
  }

  public async find(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find().populate(['owner']).exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({_id: documentId})) !== null;
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId).exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, dto, { new: true }).populate(['owner']).exec();
  }

  public async addComment(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(
      offerId,
      { $inc: { commentsCount: 1 } },
      { new: true }
    ).exec();
  }

  getFavourites(userId: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({ favoriteUserIds: userId }).populate(['owner']).exec();
  }

  public async addToFavourites(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(
        offerId,
        { $addToSet: { favoriteUserIds: userId } },
        { new: true }
      )
      .populate(['owner'])
      .exec();
  }

  public async deleteFromFavourites(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(
        offerId,
        { $pull: { favoriteUserIds: userId } },
        { new: true }
      )
      .populate(['owner'])
      .exec();
  }

  async calculateRating(offerId: string): Promise<void> {
    const offerObjectId = new Types.ObjectId(offerId);

    const result = await this.offerModel.aggregate([
      { $match: { _id: offerObjectId } },
      { $lookup: { from: 'comments', localField: '_id', foreignField: 'offerId', as: 'comments' } },
      { $unwind: { path: '$comments', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$_id',
          averageRating: { $avg: '$comments.rating' },
          commentsCount: { $sum: { $cond: [{ $ifNull: ['$comments', false] }, 1, 0] } }
        }
      },
      {
        $project: {
          averageRating: { $ifNull: ['$averageRating', 0] },
          commentsCount: 1,
          rating: { $round: [{ $ifNull: ['$averageRating', 0] }, 1] }
        }
      }
    ]);

    if (result.length > 0) {
      const { commentsCount, rating } = result[0];

      await this.offerModel.findByIdAndUpdate(
        offerId,
        { rating, commentsCount }
      );
    }
  }

  findPremiumInCity(city: City): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({ city, isPremium: true }).populate(['owner']).exec();
  }
}
