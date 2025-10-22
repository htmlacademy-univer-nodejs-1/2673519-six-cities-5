import { Amenity, HousingType } from '../../../types/index.js';

export class UpdateOfferDto {
  title: string;
  description: string;
  preview: string;
  images: [];
  isPremium?: boolean;
  isFavorite?: boolean;
  housingType: HousingType;
  roomsCount: number;
  guestsCount: number;
  price: number;
  amenities: Amenity[];
}
