export const userTypes = ['обычный', 'pro'] as const;
export type UserType = typeof userTypes[number];

export function tryParseUserType(str: string): UserType | undefined {
  const foundStr = userTypes.find((val) => val === str);
  return foundStr;
}
