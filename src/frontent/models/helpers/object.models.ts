export type ObjectType<T = any, P extends PropertyKey = PropertyKey> = Record<P, T>;

export type EmptyObjectType = Record<PropertyKey, never>;

export type PartialBy<T extends ObjectType, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type PartialKeys<T extends ObjectType> = {
  [K in keyof T]?: Partial<T[K]>;
};

export type NonNullableKeys<T> = {
  [K in keyof T]-?: NonNullable<T[K]>;
};

export type OmitKeysByType<T extends ObjectType, N> = {
  [K in keyof T as T[K] extends N ? never : K]: T[K];
};

export type ObjectKeys<T> = T extends ObjectType
  ? (keyof T)[]
  : T extends number
  ? []
  : T extends Array<any> | string
  ? string[]
  : never;
