export type Constructor<T> = {
  new (...args: any[]): T;
  prototype: T;
};

export type ConstructorsTuple<T extends any[]> = Constructor<keyof T>[];

// export type TestConstructorsTuple<T extends any[]> = Constructor<ArrayElement<T>>[];
export type TestConstructorsTuple<T extends any[]> = Iterator1<4, Constructor<ArrayElement<T>>[]>;

// export type ConstructorsTuple<T extends unknown[]> = T extends {
//   new (...args: any[]): (infer R)[];
// }[]
//   ? R
//   : never;

export type Cast<X, Y> = X extends Y ? X : Y;

// export type ArrayElement<ArrayType extends unknown[]> = ArrayType extends (infer ElementType)[]
//   ? ElementType
//   : never;

export type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

export type Length<T extends any[]> = T["length"];

export type Pos<I extends any[]> = Length<I>; // alias

export type Next<I extends any[]> = Prepend<any, I>;

/**
 * Creates new tuple type based on "Index" and "From" generics
 * @example
 * type T1 = Iterator<4>;
 * // returns: [any, any, any, any] tuple type
 * @example
 * type T1 = Iterator<4, [any, any]>;
 * // returns: [any, any, any, any, any, any] tuple type
 */
export type Iterator<Index extends number = 0, From extends any[] = [], I extends any[] = []> = {
  0: Iterator<Index, Next<From>, Next<I>>;
  1: From;
}[Pos<I> extends Index ? 1 : 0];

export type Iterator1<
  From extends any[],
  I extends any[] = [],
  Index extends number = Length<From>,
  > = {
  0: Iterator<Index, Next<From>, Next<I>>;
  1: From;
}[Pos<I> extends Index ? 1 : 0];

