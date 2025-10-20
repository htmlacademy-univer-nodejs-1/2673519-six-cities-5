export const userTypes = ['обычный', 'pro'] as const;
export type UserType = typeof userTypes[number];

export function tryParseUserType(str: string): UserType {
  const foundStr = userTypes.find((val) => val === str);
  if (!foundStr) {
    throw new Error(
      `Invalid user type: "${str}". Available user types: ${userTypes.join(', ')}`
    );
  }
  return foundStr;
}
