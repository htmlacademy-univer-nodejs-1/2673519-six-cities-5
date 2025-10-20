import { Amenity } from './amenity.type.js';
import { City } from './city.type.js';
import { Coordinates } from './coordinates.interface.js';
import { HousingType } from './housing-type.type.js';
import { User } from './user.interface.js';

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
  owner: User;
  commentsCount: number;
  coordinates: Coordinates;
}
