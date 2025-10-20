import { Offer } from '../../types/offer.interface.js';
import { OfferParser } from './offer-parser.interface.js';
import { tryParseCity, tryParseHousingType, tryParseAmenity, Amenity, tryParseUserType } from '../../types/index.js';

export class TSVOfferParser implements OfferParser {
  public parse(line: string): Offer {
    const [
      title, description, openDate, city, preview, images,
      isPremium, isFavorite, rating, housingType, rooms,
      guests, price, amenities, ownerName, ownerEmail,
      ownerAvatar, ownerType, commentsCount, coordinatesString
    ] = line.split('\t');

    // Parse coordinates from "latitude,longitude" format
    const [latitude, longitude] = coordinatesString.split(',');

    return {
      title,
      description,
      openDate: new Date(openDate),
      city: tryParseCity(city),
      preview,
      images: images.split(';'),
      isPremium: isPremium === 'true',
      isFavorite: isFavorite === 'true',
      rating: parseFloat(rating),
      housingType: tryParseHousingType(housingType),
      roomsCount: parseInt(rooms, 10),
      guestsCount: parseInt(guests, 10),
      price: parseInt(price, 10),
      amenities: amenities.split(';')
        .map((amenity) => tryParseAmenity(amenity))
        .filter((amenity): amenity is Amenity => amenity !== undefined),
      owner: {
        name: ownerName,
        email: ownerEmail,
        avatar: ownerAvatar,
        password: '',
        type: tryParseUserType(ownerType)
      },
      commentsCount: parseInt(commentsCount, 10),
      coordinates: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      }
    };
  }
}
