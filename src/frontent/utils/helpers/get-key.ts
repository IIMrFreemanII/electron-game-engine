import { ObjectType } from "frontent/models";
import { getValue, swapObject } from "frontent/utils";

export const getKey = <T extends ObjectType<string, string>, V extends T[keyof T]>(
  obj: T,
  value: V,
): { [K in keyof T as T[K]]: K }[V] => getValue(swapObject(obj), value);
