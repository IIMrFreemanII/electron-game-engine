import React from "react";

export type Negatives = null | undefined;

export type Primitives = number | string | boolean | bigint | Negatives;

export type ExtractComponent<Type> = Type extends React.FC<infer X> ? X : never;

export type Nullable<T> = T | Negatives;

export type Cast<X, Y> = X extends Y ? X : Y;
