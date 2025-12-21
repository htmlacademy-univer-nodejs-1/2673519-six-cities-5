import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../user/rdo/user.rdo.js';
import { Amenity, City, HousingType, Coordinates } from '../../../types/index.js';

export class OfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public openDate: Date;

  @Expose()
  public city: City;

  @Expose()
  public preview: string;

  @Expose()
  public images: string[];

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public housingType: HousingType;

  @Expose()
  public roomsCount: number;

  @Expose()
  public guestsCount: number;

  @Expose()
  public price: number;

  @Expose()
  public amenities: Amenity[];

  @Expose({ name: 'owner'})
  @Type(() => UserRdo)
  public owner: UserRdo;

  @Expose()
  public commentsCount: number;

  @Expose()
  public coordinates: Coordinates;
}
