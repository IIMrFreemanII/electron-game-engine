const handlers = Symbol("handlers");

export type ObservableObject<T> = T & {
  __original: T;
  [handlers]: (prop, value) => void[];
  addObserve(handler: (prop, value) => void): void;
  removeObserve(handler: (prop, value) => void): void;
};

export const isObservable = (obj) => {
  return !!obj.__original;
};

export function makeObservable(target) {
  if (isObservable(target)) {
    return target;
  }

  Object.entries(target).forEach(([key, value]) => {
    if (typeof value === "object") {
      target[key] = makeObservable(value);
    }
  });

  // 1. Initialize handlers store
  target[handlers] = new Map<PropertyKey, (target, prop, value) => void>();

  // Store the handler function in array for future calls
  Object.defineProperty(target, "addObserve", {
    value: function (prop, handler) {
      this[handlers].set(prop, handler);
    },
    configurable: true,
    writable: false,
    enumerable: false,
  });
  Object.defineProperty(target, "removeObserve", {
    value: function (prop) {
      this[handlers].delete(prop);
    },
    configurable: true,
    writable: false,
    enumerable: false,
  });

  // 2. Create a proxy to handle changes
  return new Proxy(target, {
    set(target, property, value, receiver) {
      const success = Reflect.set(target, property, value, receiver); // forward the operation to object
      if (success) {
        // if there were no error while setting the property
        // call all handlers
        target[handlers].get(property)?.(target, property, value);
      }
      return success;
    },
    get(target, prop) {
      if (prop !== "__original") {
        return target[prop];
      }
      return target;
    },
  });
}

export const removeObservable = (object: any) => {
  if (isObservable(object)) {
    const result = object.__original;
    delete result[handlers];
    delete result.addObserve;
    delete result.removeObserve;

    Object.entries(object).forEach(([key, value]) => {
      result[key] = removeObservable(value);
    });

    return result;
  }

  return object;
};
