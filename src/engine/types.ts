export type Constructor<T> = {
  new (...args: any[]): T;
  prototype: T;
};
