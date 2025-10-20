export function getMongoDbURI(
  username: string,
  password: string,
  host: string,
  port: string,
  name: string,
): string {
  return `mongodb://${username}:${password}@${host}:${port}/${name}?authSource=admin`;
}
