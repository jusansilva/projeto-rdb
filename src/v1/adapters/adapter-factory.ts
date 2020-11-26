export interface GenericFactory<T> {
  build: () => T;
}
