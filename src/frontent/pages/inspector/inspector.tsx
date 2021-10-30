import React, { memo, useEffect, useState } from "react";
import cn from "classnames";

import { Entity } from "engine/ecs/entity";
import { EntitySelection } from "engine/entity-selection";
import { ComponentView } from "frontent/components";

import styles from "./inspector.module.scss";

export interface InspectorProps {
  className?: string;
}

const useInspect = () => {
  const [data, setData] = useState<Entity | null>(null);

  const handleSelect = (entity: Entity | null) => {
    entity?.addComponentsProxy();
    setData((prev) => {
      prev?.removeComponentsProxy();
      return entity;
    });
  };

  useEffect(() => {
    EntitySelection.addListener("select", handleSelect);
    return () => EntitySelection.removeListener("select", handleSelect);
  }, []);

  return data;
};

export const Inspector: React.FC<InspectorProps> = memo(({ className = "" }: InspectorProps) => {
  const inspectedEntity = useInspect();

  // inspectedEntity?.components.forEach((comp) => {
  //   console.log(comp);
  // });
  console.log("inspector render");

  return (
    <div className={cn(styles.container, className)}>
      <div className={styles.header}>Inspector</div>
      {inspectedEntity && (
        <div>
          <div>Entity {inspectedEntity?.id}</div>
          {inspectedEntity.components.map((component, i) => (
            <ComponentView key={i} component={component} />
          ))}
        </div>
      )}
    </div>
  );
});

export default Inspector;
