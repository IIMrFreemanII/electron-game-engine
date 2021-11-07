import { ObjectKeys, ObjectType } from "frontent/models";

export const objectKeys = <T extends ObjectType>(o: T): ObjectKeys<T> =>
  Object.keys(o) as ObjectKeys<T>;
