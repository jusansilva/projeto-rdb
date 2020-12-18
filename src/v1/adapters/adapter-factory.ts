export interface Factory<T> {
  build: () => T;
}
