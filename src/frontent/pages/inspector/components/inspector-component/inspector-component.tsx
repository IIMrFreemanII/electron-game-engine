import React, { memo, useEffect, useState } from "react";
import cn from "classnames";

import { Component } from "engine/ecs/component";
import { CollapseSelfControlled, Button, Input, InputLineStatuses } from "frontent/components";
import { ObjectType } from "frontent/models";
import { useDidMount } from "frontent/hooks";
import { concatenate } from "frontent/utils";

import styles from "./inspector-component.module.scss";
import { ReactComponent as CollapseIconSVG } from "frontent/assets/images/rounded-arrow-right-grey.svg";

export const useFieldUpdate = (target, prop, value) => {
  const [data, setData] = useState({ target, prop, value });

  const handleUpdate = (target1, prop1, value1) => {
    // console.log("useFieldUpdate");
    // todo: fix bug with switching
    if (target.__target === target1 && prop === prop1) {
      console.log("field", target.__target);
      setData((prev) => {
        // console.log(prev);
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

// export const useComponentUpdate = (target) => {
//   const [data, setData] = useState({ target });
//   const handleUpdate = (target1) => {
//     console.log("component", target);
//     if (target.getTarget() === target1) {
//       setData((prev) => {
//         return { ...prev };
//       });
//     }
//   };
//   useEffect(() => {
//     Component.addListener("change", handleUpdate);
//     return () => Component.removeListener("change", handleUpdate);
//   }, []);
//
//   return data;
// };

const statusMap: ObjectType<InputLineStatuses, "x" | "y" | "z"> = {
  x: "error",
  y: "success",
  z: "warning",
};

export interface ValueFieldProps {
  target: any;
  prop: any;
  value: any;
}

const FieldByType: React.FC<ValueFieldProps> = ({ prop, value, target }: ValueFieldProps) => {
  const [data, setData] = useState({ target, prop, value });

  const handleUpdate = (target1, prop1, value1) => {
    if (target.__target === target1 && prop === prop1) {
      setData((prev) => ({ ...prev, value: value1 }));
    }
  };

  useDidMount(() => {
    Component.addListener("change", handleUpdate);
    return () => Component.removeListener("change", handleUpdate);
  });

  const handleChange = (value: string) => {
    data.target[data.prop] = value;
  };

  const label = data.prop + ":";

  if (typeof value === "object" && !Array.isArray(value)) {
    const entries = Object.entries(value);
    return (
      <>
        {entries.map(([key1, value1], i) => (
          <FieldByType key={i} prop={key1} value={value1} target={value} />
        ))}
      </>
    );
  }

  if (typeof value === "object" && Array.isArray(value)) {
    const entries = Object.entries(value);
    return (
      <>
        <div>{prop}</div>
        {entries.map(([key1, value1], i) => (
          <FieldByType key={i} prop={key1} value={value1} target={value} />
        ))}
      </>
    );
  }

  if (typeof value === "number") {
    return (
      <Input
        type="number"
        statusLine={statusMap[data.prop]}
        label={label}
        value={data.value}
        onChange={handleChange}
        normalize={(value) => {
          if (isNaN(Number(value))) return 0;
          return Number(value);
        }}
        disableError
      />
    );
  }

  if (typeof value === "string") {
    return <Input label={label} value={data.value} onChange={handleChange} disableError />;
  }

  return <div>Unsupported field</div>;
};

export interface InspectorComponentProps {
  component: Component;
}

export const InspectorComponent: React.FC<InspectorComponentProps> = memo(
  ({ component }: InspectorComponentProps) => {
    // useComponentUpdate(component);
    const { entity, ...rest } = component;
    const fields = Object.entries(rest);

    console.log(component.type, "render");

    return (
      <div className={styles.container}>
        <CollapseSelfControlled
          triggerClassName={styles.triggerWrapper}
          contentClassName={styles.collapseWrapper}
          triggerElement={({ isOpened, triggerOpening }) => (
            <>
              <Button onClick={triggerOpening} imageBtn>
                <CollapseIconSVG className={cn(styles.icon, { [styles.opened]: isOpened })} />
              </Button>
              <span>{component.type}</span>
            </>
          )}
          openDuration={150}
          hideDuration={150}
          removeFromDOMOnClosed
        >
          {fields.map(([prop, value], i) => (
            <FieldByType
              key={concatenate(entity.id, i)}
              prop={prop}
              value={value}
              target={component}
            />
          ))}
        </CollapseSelfControlled>
      </div>
    );
  },
);
