import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto, OfferEntity } from './index.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { City } from '../../types/city.type.js';

export interface IOfferService {
  create(dto: CreateOfferDto, ownerId: string): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  find(): Promise<DocumentType<OfferEntity>[]>;
  exists(documentId: string): Promise<boolean>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  addComment(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  getFavourites(userId: string): Promise<DocumentType<OfferEntity>[]>;
  addToFavourites(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null>;
  deleteFromFavourites(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null>;
  calculateRating(offerId: string): Promise<void>;
  findPremiumInCity(city: City): Promise<DocumentType<OfferEntity>[]>;
}
