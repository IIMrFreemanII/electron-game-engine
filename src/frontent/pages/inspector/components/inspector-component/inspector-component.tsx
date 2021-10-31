import React, { memo, useCallback, useState } from "react";
import cn from "classnames";

import { Component } from "engine/ecs/component";
import { CollapseSelfControlled, Button, Input, InputLineStatuses } from "frontent/components";
import { ObjectType } from "frontent/models";
import { useDidMount } from "frontent/hooks";

import styles from "./inspector-component.module.scss";
import { ReactComponent as CollapseIconSVG } from "frontent/assets/images/rounded-arrow-right-grey.svg";
import cuid from "cuid";

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

const FieldByType: React.FC<ValueFieldProps> = ({ prop, value, target }) => {
  const [data, setData] = useState({ target, prop, value });

  const handleUpdate = useCallback((target1, prop1, value1) => {
    setData((prev) => ({ ...prev, value: value1 }));
  }, []);

  useDidMount(() => {
    target.addObserve(prop, handleUpdate);
    return () => target.removeObserve?.(prop);
  });

  const handleChange = (value: string) => {
    data.target[data.prop] = value;
  };

  const label = data.prop + ":";

  if (typeof value === "object" && !Array.isArray(value)) {
    const entries = Object.entries(value);
    return (
      <>
        {entries.map(([key1, value1]) => (
          <FieldByType key={cuid()} prop={key1} value={value1} target={value} />
        ))}
      </>
    );
  }

  if (typeof value === "object" && Array.isArray(value)) {
    const entries = Object.entries(value);
    return (
      <>
        <div>{prop}</div>
        {entries.map(([key1, value1]) => (
          <FieldByType key={cuid()} prop={key1} value={value1} target={value} />
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
