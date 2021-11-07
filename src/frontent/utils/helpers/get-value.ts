import { ObjectType } from "frontent/models";

export const getValue = <T extends ObjectType, K extends keyof T>(obj: T, key: K): T[K] => obj[key];
