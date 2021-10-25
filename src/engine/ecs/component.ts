import { Entity } from "./entity";
import EventEmitter from "eventemitter3";

export const isProxy = (obj) => {
  return !!obj.__target;
};

export const proxyComponent = (object: any) => {
  if (isProxy(object)) {
    return object;
  }

  Object.entries(object).forEach(([key, value]) => {
    if (typeof value === "object" && key !== "entity") {
      object[key] = proxyComponent(value);
    }
  });

  return new Proxy(object, {
    set(target, prop, value) {
      if (prop !== "entity") {
        Component.handleUpdate(target, prop, value);
      }
      target[prop] = value;
      return true;
    },
    get(target, prop) {
      if (prop !== "__target") {
        return target[prop];
      }
      return target;
    },
  });
};

export const removeProxy = (object: any) => {
  if (isProxy(object)) {
    const result = object.__target;

    Object.entries(object).forEach(([key, value]) => {
      result[key] = removeProxy(value);
    });

    return result;
  }

  return object;
};

type EventTypes = "change";

export class Component {
  private static emitter = new EventEmitter();

  public static handleUpdate(target, prop, value) {
    // console.log("handle update");
    this.emitter.emit("change", target, prop, value);
  }

  public static addListener(event: EventTypes, callback: (target, prop, value) => void) {
    this.emitter.addListener(event, callback);
  }

  public static removeListener(event: EventTypes, callback: (target, prop, value) => void) {
    this.emitter.removeListener(event, callback);
  }

  entity: Entity;

  get type() {
    return this.constructor.name;
  }
}
