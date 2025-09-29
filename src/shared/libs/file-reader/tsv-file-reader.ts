import { FileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';
import { Offer, Amenity, tryParseCity, tryParseAmenity, tryParseHousingType } from '../../types/index.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(([title, description, openDate, city, preview, images, isPremium, isFavorite, rating, housingType, rooms, guests, price, amenities, email, commentsCount, latitude, longitude]) => ({
        title,
        description,
        openDate: new Date(openDate),
        city: tryParseCity(city),
        preview: preview,
        images: images.split(';'),
        isPremium: isPremium === 'true',
        isFavorite: isFavorite === 'true',
        rating: parseFloat(rating),
        housingType: tryParseHousingType(housingType),
        roomsCount: parseInt(rooms, 10),
        guestsCount: parseInt(guests, 10),
        price: parseInt(price, 10),
        amenities: amenities.split(';')
          .map(amenity => tryParseAmenity(amenity))
          .filter((amenity): amenity is Amenity => amenity !== undefined),
        owner: email,
        commentsCount: parseInt(commentsCount, 10),
        coordinates: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        }
      }));
  }
}
