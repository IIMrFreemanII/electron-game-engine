import React, { memo, useCallback, useState } from "react";
import cuid from "cuid";
import cn from "classnames";

import { CollapseSelfControlled, Button, Input, InputLineStatuses } from "frontent/components";
import { ObservableObject } from "engine/observable";
import { ObjectType } from "frontent/models";
import { useDidMount } from "frontent/hooks";

import styles from "./inspector-component.module.scss";
import { ReactComponent as CollapseIconSVG } from "frontent/assets/images/rounded-arrow-right-grey.svg";
import { Vector2, Vector3, Vector4 } from "three";

const statusMap: ObjectType<InputLineStatuses> = {
  x: "error",
  y: "success",
  z: "warning",
  w: "white",
};

export interface ValueFieldProps<T extends ObservableObject> {
  target: T;
  prop: keyof T;
  value: any;
}

const FieldByType = <T extends ObservableObject>({ prop, value, target }: ValueFieldProps<T>) => {
  const [data, setData] = useState({ target, prop, value });

  const handleUpdate = useCallback((target1, prop1, value1) => {
    setData((prev) => ({ ...prev, value: value1 }));
  }, []);

  useDidMount(() => {
    target.addObserve(prop, handleUpdate);
    return () => target.removeObserve?.(prop);
  });

  const handleChange = (value) => {
    data.target[data.prop] = value;
  };

  const label = data.prop + ":";

  if (value instanceof Vector2 || value instanceof Vector3 || value instanceof Vector4) {
    const entries = Object.entries(value);
    return (
      <div className={styles.vectorWrapper}>
        <div>{prop}</div>
        <div className={styles.inputsWrapper}>
          {entries.map(([key1, value1]) => (
            <FieldByType key={cuid()} prop={key1} value={value1} target={value as any} />
          ))}
        </div>
      </div>
    );
  }

  // if (Array.isArray(value)) {
  //   const entries = Object.entries(value);
  //   return (
  //     <>
  //       <div>{prop}</div>
  //       {entries.map(([key1, value1]) => (
  //         <FieldByType key={cuid()} prop={key1} value={value1} target={value} />
  //       ))}
  //     </>
  //   );
  // }

  if (typeof value === "number") {
    return (
      <Input
        type="number"
        inputWrapperClassName={styles.inputWrapper}
        className={styles.inputContainer}
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

  return (
    <Input
      label={label}
      value={`None (${value.constructor.name})`}
      onChange={handleChange}
      disableError
      disableTextEdition
    />
  );
};

export interface InspectorComponentProps {
  component: ObservableObject;
}

export const InspectorComponent: React.FC<InspectorComponentProps> = memo(({ component }) => {
  const fields = Object.entries(component);

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
        {fields.map(([prop, value]) => (
          <FieldByType key={cuid()} prop={prop} value={value} target={component} />
        ))}
      </CollapseSelfControlled>
    </div>
  );
});
