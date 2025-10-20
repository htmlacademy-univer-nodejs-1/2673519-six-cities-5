import { Amenity, City, HousingType, Coordinates } from '../../../types/index.js';

export class CreateOfferDto {
  title: string;
  description: string;
  openDate: Date;
  city: City;
  preview: string;
  images: string[];
  isPremium?: boolean;
  isFavorite?: boolean;
  rating?: number;
  housingType: HousingType;
  roomsCount: number;
  guestsCount: number;
  price: number;
  amenities: Amenity[];
  owner: string;
  commentsCount: number;
  coordinates: Coordinates;
}
