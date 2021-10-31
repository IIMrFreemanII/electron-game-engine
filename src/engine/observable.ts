const handlers = Symbol("handlers");

export const isObservable = (obj) => {
  return !!obj.__original;
};

export function makeObservable(target) {
  if (isObservable(target)) {
    return target;
  }

  // Object.entries(target).forEach(([key, value]) => {
  //   if (typeof value === "object") {
  //     target[key] = makeObservable(value);
  //   }
  // });

  // 1. Initialize handlers store
  target[handlers] = [];

  // Store the handler function in array for future calls
  target.addObserve = function (handler) {
    this[handlers].push(handler);
  };
  target.removeObserve = function (handler) {
    this[handlers] = this[handlers].filter((item) => item !== handler);
  };

  // 2. Create a proxy to handle changes
  return new Proxy(target, {
    set(target, property, value, receiver) {
      const success = Reflect.set(target, property, value, receiver); // forward the operation to object
      if (success) {
        // if there were no error while setting the property
        // call all handlers
        target[handlers].forEach((handler) => handler(property, value));
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
    const result = object.__target;

    // Object.entries(object).forEach(([key, value]) => {
    //   result[key] = removeObservable(value);
    // });

    return result;
  }

  return object;
};
