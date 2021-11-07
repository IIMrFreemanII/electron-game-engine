import { ObjectType } from "frontent/models";

export const swapObject = <T extends ObjectType<string, string>>(
  obj: T,
): { [K in keyof T as T[K]]: K } =>
  Object.entries(obj).reduce(
    (acc, [key, value]) => Object.assign(acc, { [value]: key }),
    {},
  ) as any;
