export const amenities = ['Breakfast', 'Air conditioning', 'Laptop friendly workspace', 'Baby seat', 'Washer', 'Towels', 'Fridge'] as const;
export type Amenity = typeof amenities[number];

export function tryParseAmenity(str: string): Amenity {
  const foundStr = amenities.find((val) => val === str);
  if (!foundStr) {
    throw new Error(`Invalid amenity: "${str}". Available values: ${amenities.join(', ')}`);
  }
  return foundStr;
}
