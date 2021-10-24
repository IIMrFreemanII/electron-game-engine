import React, { FC, useEffect, useState } from "react";
import { Component } from "../../../engine/ecs/component";
import { StringField } from "./components/string-field";
import { NumberField } from "./components/number-field";

export const useFieldUpdate = (target, prop, value) => {
  const [data, setData] = useState({ target, prop, value });
  const handleUpdate = (target1, prop1, value1) => {
    // console.log("useFieldUpdate");
    // todo: fix bug with switching
    if (target?.getTarget?.() === target1 && prop === prop1) {
      setData((prev) => ({ ...prev, value: value1 }));
    }
  };
  useEffect(() => {
    Component.addListener("change", handleUpdate);
    return () => Component.removeListener("change", handleUpdate);
  }, []);

  return data;
};

interface ComponentViewProps {
  component: Component;
}

export interface ValueFieldProps {
  target: any;
  prop: any;
  value: any;
}

export const ComponentView: FC<ComponentViewProps> = ({ component }) => {
  const { entity, ...rest } = component;
  const fields = Object.entries(rest);

  console.log(component.type, "render");

  const getFieldByType = (key, value, ref) => {
    if (typeof value === "object" && !Array.isArray(value)) {
      const entries = Object.entries(value);
      return entries.map(([key1, value1]) => (
        <div key={key1}>{getFieldByType(key1, value1, value)}</div>
      ));
    }

    if (typeof value === "object" && Array.isArray(value)) {
      const entries = Object.entries(value);
      return (
        <div>
          <div>{key}</div>
          {entries.map(([key1, value1]) => (
            <div key={key1}>{getFieldByType(key1, value1, value)}</div>
          ))}
        </div>
      );
    }

    if (typeof value === "number") {
      return <NumberField key={key} target={ref} prop={key} value={value} />;
    }

    if (typeof value === "string") {
      return <StringField key={key} target={ref} prop={key} value={value} />;
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
