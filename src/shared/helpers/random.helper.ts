export function generateRandomValue(min: number, max: number, numAfterDigit = 0): number {
  if (min > max) {
    throw new Error('Min value cannot be greater than max value');
  }

  if (numAfterDigit < 0) {
    throw new Error('numAfterDigit cannot be negative');
  }

  const random = Math.random() * (max - min) + min;
  return Number(random.toFixed(numAfterDigit));
}

export function getRandomItems<T>(items: T[]): T[] {
  if (items.length === 0) {
    return [];
  }

  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition = startPosition + generateRandomValue(0, items.length - startPosition);
  return items.slice(startPosition, endPosition + 1);
}

export function getRandomItem<T>(items: T[]): T {
  if (items.length === 0) {
    throw new Error('Array is empty');
  }

  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

export function getRandomBoolean(): boolean {
  return Math.random() > 0.5;
}
