export const housingTypes = ['apartment', 'house', 'room', 'hotel'] as const;
export type HousingType = typeof housingTypes[number];

export function tryParseHousingType(str: string): HousingType {
  const foundStr = housingTypes.find((val) => val === str);
  if (!foundStr) {
    throw new Error(
      `Invalid housing type: "${str}". Available types: ${housingTypes.join(', ')}`
    );
  }
  return foundStr;
}
