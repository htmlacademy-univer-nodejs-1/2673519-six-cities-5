import { Amenity } from './amenity.enum.js';
import { City } from './city.enum.js';
import { Coordinates } from './coordinates.interface.js';
import { HousingType } from './housing-type.enum.js';

export interface Offer {
  title: string;
  description: string;
  openDate: Date;
  city: City;
  preview: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  housingType: HousingType;
  roomsCount: number;
  guestsCount: number;
  price: number;
  amenities: Amenity[];
  owner: string;
  commentsCount: number;
  coordinates: Coordinates;
}
