import React, { memo, useState } from "react";
import cn from "classnames";

import { Entity } from "engine/ecs/entity";
import { EntitySelection } from "engine/entity-selection";
import { useDidMount } from "frontent/hooks";

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
      {inspectedEntity && <div>Entity: {inspectedEntity?.id}</div>}
    </div>
  );
});

export default Inspector;
