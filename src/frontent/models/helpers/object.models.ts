export type PropertyName = string | number | symbol;

export type ObjectType<T = unknown> = Record<PropertyName, T>;

export type EmptyObjectType = Record<PropertyName, never>;

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
