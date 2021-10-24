import React, { memo, useEffect, useLayoutEffect, useState } from "react";
import cn from "classnames";

import { Entity } from "engine/ecs/entity";
import { EntitySelection } from "engine/entity-selection";
import { useDidMount } from "frontent/hooks";
import { ComponentView } from "../../components/component-view";

import styles from "./inspector.module.scss";

export interface InspectorProps {
  className?: string;
}

const useInspect = () => {
  const [data, setData] = useState<Entity | null>(null);

  useEffect(() => {
    return () => {
      data?.removeComponentsProxy();
    };
  }, [data]);

  const handleSelect = (entity: Entity | null) => {
    if (entity) {
      entity.addComponentsProxy();
    }

    setData(entity);
  };

  useDidMount(() => {
    EntitySelection.addListener("select", handleSelect);
    return () => EntitySelection.removeListener("select", handleSelect);
  });

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
