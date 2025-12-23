import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Amenity, City, Coordinates, HousingType } from '../../types/index.js';
import { UserEntity } from '../user/index.js';

class CoordinatesSchema implements Coordinates {
  @prop({ required: true, type: () => Number })
  public latitude: number;

  @prop({ required: true, type: () => Number })
  public longitude: number;
}

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})

export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true, type: () => String })
  public title!: string;

  @prop({ trim: true, required: true, type: () => String })
  public description!: string;

  @prop({ required: true, default: Date.now, type: () => Date })
  public openDate!: Date;

  @prop({ required: true, type: () => String })
  public city: City;

  @prop({ required: true, type: () => String })
  public preview: string;

  @prop({ required: true, type: () => [String] })
  public images: string[];

  @prop({default: false, type: () => Boolean})
  public isPremium: boolean;

  @prop({ ref: UserEntity, required: true, default: [] })
  public favoriteUserIds: Ref<UserEntity>[];

  @prop({ default: 1, min: 1, max: 5, type: () => Number })
  public rating: number;

  @prop({ type: () => String })
  public housingType!: HousingType;

  @prop({required: true, type: () => Number})
  public roomsCount: number;

  @prop({required: true, type: () => Number})
  public guestsCount: number;

  @prop({required: true, type: () => Number})
  public price!: number;

  @prop({ default: [], type: () => [String] })
  public amenities: Amenity[];

  @prop({ ref: UserEntity, required: true })
  public owner!: Ref<UserEntity>;

  @prop({ default: 0, type: () => Number })
  public commentsCount!: number;

  @prop({ required: true, _id: false, type: () => CoordinatesSchema })
  public coordinates: CoordinatesSchema;
}

export const OfferModel = getModelForClass(OfferEntity);
