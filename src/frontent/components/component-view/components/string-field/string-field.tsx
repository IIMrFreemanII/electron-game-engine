import React, { FC } from "react";
import { useFieldUpdate, ValueFieldProps } from "../../component-view";

export const StringField: FC<ValueFieldProps> = ({ target, prop, value }) => {
  const data = useFieldUpdate(target, prop, value);

  // console.log("string field render", data.prop, data.value);

  return (
    <div>
      <label htmlFor={data.prop}>{data.prop}</label>
      <input
        id={data.prop}
        type="text"
        value={data.value}
        onChange={({ target: { value } }) => {
          data.target[data.prop] = value;
        }}
      />
    </div>
  );
};
