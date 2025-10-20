import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData, City, cities, HousingType, housingTypes, amenities, CITY_COORDS, userTypes } from '../../types/index.js';
import { generateRandomValue, getRandomBoolean, getRandomItem, getRandomItems } from '../../helpers/index.js';
import * as CONSTS from '../../config/config.consts.js';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(
    private readonly mockData: MockServerData
  ) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const openDate = new Date(getRandomItem<string>(this.mockData.dates));
    const city = getRandomItem<City>([...Object.values(cities)]);
    const preview = getRandomItem(this.mockData.images);
    const images = getRandomItems(this.mockData.images).join(';');
    const isPremium = getRandomBoolean();
    const isFavorite = getRandomBoolean();
    const rating = generateRandomValue(CONSTS.MIN_RATING, CONSTS.MAX_RATING);
    const housingType = getRandomItem<HousingType>([...Object.values(housingTypes)]);
    const roomsCount = generateRandomValue(CONSTS.MIN_ROOMS, CONSTS.MAX_ROOMS);
    const guestsCount = generateRandomValue(CONSTS.MIN_GUESTS, CONSTS.MAX_GUESTS);
    const price = generateRandomValue(CONSTS.MIN_PRICE, CONSTS.MAX_PRICE);
    const amens = getRandomItems([...Object.values(amenities)]).join(';');
    const ownerName = getRandomItem<string>(this.mockData.users);
    const ownerEmail = getRandomItem<string>(this.mockData.emails).toString();
    const ownerAvatar = getRandomItem<string>(this.mockData.images).toString();
    const ownerType = getRandomItem([...userTypes]).toString();
    const commentsCount = generateRandomValue(0, 100);
    const coords = `${CITY_COORDS[city].latitude},${CITY_COORDS[city].longitude}`;

    return [
      title,
      description,
      openDate,
      city,
      preview,
      images,
      isPremium,
      isFavorite,
      rating,
      housingType,
      roomsCount,
      guestsCount,
      price,
      amens,
      ownerName,
      ownerEmail,
      ownerAvatar,
      ownerType,
      commentsCount,
      coords
    ].join('\t');
  }
}
