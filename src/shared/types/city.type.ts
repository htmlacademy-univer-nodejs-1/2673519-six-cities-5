const cities = ['Paris', 'Cologne', 'Brussels', 'Amsterdam', 'Hamburg', 'Dusseldorf'] as const;
export type City = typeof cities[number];

export function tryParseCity(str: string): City | undefined
{
    const foundStr = cities.find((val) => val === str);
    return foundStr;
}
