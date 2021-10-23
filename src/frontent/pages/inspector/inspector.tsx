import React, { memo, useState } from "react";
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

  useDidMount(() => {
    EntitySelection.addListener("select", setData);
    return () => EntitySelection.removeListener("select", setData);
  });

  return data;
};

export const Inspector: React.FC<InspectorProps> = memo(({ className = "" }: InspectorProps) => {
  const inspectedEntity = useInspect();

  return (
    <div className={cn(styles.container, className)}>
      <div className={styles.header}>Inspector</div>
      {inspectedEntity && (
        <div>
          <div>Entity: {inspectedEntity?.id}</div>
          {inspectedEntity.components.map((component, i) => (
            <ComponentView key={i} component={component} />
          ))}
        </div>
      )}
    </div>
  );
});

export default Inspector;
