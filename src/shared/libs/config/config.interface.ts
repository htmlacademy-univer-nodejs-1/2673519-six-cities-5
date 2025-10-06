export interface IConfig<T> {
  get<K extends keyof T>(key: K): T[K];
}
