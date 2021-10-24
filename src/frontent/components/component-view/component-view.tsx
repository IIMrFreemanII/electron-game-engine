import React, { FC } from "react";
import { Component } from "../../../engine/ecs/component";

interface ComponentViewProps {
  component: Component;
}

export const ComponentView: FC<ComponentViewProps> = ({ component }) => {
  const { entity, ...rest } = component;
  const fields = Object.entries(rest);

  const getFieldByType = (key, value, ref) => {
    if (typeof value === "object" && !Array.isArray(value)) {
      const entries = Object.entries(value);
      return entries.map(([key1, value1]) => <div>{getFieldByType(key1, value1, value)}</div>);
    }

    if (typeof value === "object" && Array.isArray(value)) {
      const entries = Object.entries(value);
      return (
        <div>
          <div>{key}</div>
          {entries.map(([key1, value1]) => (
            <div>{getFieldByType(key1, value1, value)}</div>
          ))}
        </div>
      );
    }

    if (typeof value === "number") {
      return (
        <div>
          <label htmlFor={key}>{key}</label>
          <input
            id={key}
            type="number"
            defaultValue={value}
            onChange={(e) => {
              const {
                target: { valueAsNumber },
              } = e;
              if (isNaN(valueAsNumber)) {
                ref[key] = 0;
                e.target.value = "0";
              } else {
                ref[key] = valueAsNumber;
              }

              console.log(ref);
            }}
          />
        </div>
      );
    }

    if (typeof value === "string") {
      return (
        <div>
          <label htmlFor={key}>{key}</label>
          <input
            id={key}
            type="text"
            defaultValue={value}
            onChange={({ target: { value } }) => {
              ref[key] = value;
              console.log(ref);
            }}
          />
        </div>
      );
    }

    return <div>Unsupported field</div>;
  };

  return (
    <div>
      <div>{component.type}</div>
      {fields.map(([key, value], i) => {
        return <div key={i}>{getFieldByType(key, value, component)}</div>;
      })}
    </div>
  );
};
