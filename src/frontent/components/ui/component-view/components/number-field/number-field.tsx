import React, { FC } from "react";
import { useFieldUpdate, ValueFieldProps } from "../../component-view";

export const NumberField: FC<ValueFieldProps> = ({ target, prop, value }) => {
  const data = useFieldUpdate(target, prop, value);

  console.log("number field render", data.prop, data.value);

  return (
    <div>
      <label htmlFor={data.prop}>{data.prop}</label>
      <input
        id={data.prop}
        type="number"
        value={data.value}
        onChange={(e) => {
          const {
            target: { valueAsNumber },
          } = e;

          if (isNaN(valueAsNumber)) {
            if (data.target[data.prop] !== 0) {
              data.target[data.prop] = 0;
            }
            e.target.value = "0";
            return;
          }

          data.target[data.prop] = valueAsNumber;
        }}
      />
    </div>
  );
};
