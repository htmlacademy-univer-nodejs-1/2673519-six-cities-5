import { Offer } from '../../types/offer.interface.js';

export interface OfferParser {
  parse(line: string): Offer;
}
