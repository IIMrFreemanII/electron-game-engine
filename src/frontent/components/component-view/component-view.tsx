import React, { FC } from "react";
import { Component } from "../../../engine/ecs/component";

interface ComponentViewProps {
  component: Component;
}

export const ComponentView: FC<ComponentViewProps> = ({ component }) => {
  const { entity, ...rest } = component;
  const fields = Object.entries(rest);
  console.log(fields);

  return (
    <div>
      <div>{component.type}</div>
      {fields.map(([key, value], i) => {
        return (
          <div key={i}>
            {key} {JSON.stringify(value)}
          </div>
        );
      })}
    </div>
  );
};
