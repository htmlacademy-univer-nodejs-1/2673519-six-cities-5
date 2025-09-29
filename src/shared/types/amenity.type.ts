const amenities = ['Breakfast', 'Air conditioning', 'Laptop friendly workspace', 'Baby seat', 'Washer', 'Towels', 'Fridge'] as const;
export type Amenity = typeof amenities[number];

export function tryParseAmenity(str: string): Amenity | undefined
{
    const foundStr = amenities.find((val) => val === str);
    return foundStr;
}
