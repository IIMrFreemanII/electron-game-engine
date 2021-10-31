import React, { FC, useEffect, useState } from "react";
import cuid from "cuid";

import { Component } from "engine/ecs/component";
import { StringField } from "./components/string-field";
import { NumberField } from "./components/number-field";

export const useFieldUpdate = (target, prop, value) => {
  const [data, setData] = useState({ target, prop, value });
  const handleUpdate = (target1, prop1, value1) => {
    if (target.__target === target1 && prop === prop1) {
      setData((prev) => {
        return { ...prev, value: value1 };
      });
    }
  };
  useEffect(() => {
    Component.addListener("change", handleUpdate);
    return () => Component.removeListener("change", handleUpdate);
  }, []);

  return data;
};

export const useComponentUpdate = (target) => {
  const [data, setData] = useState({ target });
  const handleUpdate = (target1) => {
    console.log("component", target);
    if (target.getTarget() === target1) {
      setData((prev) => {
        return { ...prev };
      });
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

const getFieldByType = (prop, value, target) => {
  if (typeof value === "object" && !Array.isArray(value)) {
    const entries = Object.entries(value);
    return entries.map(([key1, value1], i) => {
      return <div key={cuid()}>{getFieldByType(key1, value1, value)}</div>;
    });
  }

  if (typeof value === "object" && Array.isArray(value)) {
    const entries = Object.entries(value);
    return (
      <div>
        <div>{prop}</div>
        {entries.map(([key1, value1], i) => {
          return <div key={cuid()}>{getFieldByType(key1, value1, value)}</div>;
        })}
      </div>
    );
  }

  if (typeof value === "number") {
    return <NumberField target={target} prop={prop} value={value} />;
  }

  if (typeof value === "string") {
    return <StringField target={target} prop={prop} value={value} />;
  }

  return <div>Unsupported field</div>;
};

export const ComponentView: FC<ComponentViewProps> = ({ component }) => {
  // useComponentUpdate(component);
  const { entity, ...rest } = component;
  const fields = Object.entries(rest);

  console.log(component.type, "render");

  return (
    <div>
      <div>{component.type}</div>
      {fields.map(([prop, value], i) => {
        return <div key={cuid()}>{getFieldByType(prop, value, component)}</div>;
      })}
    </div>
  );
};
