import React, { memo, useRef, useCallback } from "react";
import cn from "classnames";

import { World } from "engine/ecs/world";
import { EntitySelection } from "engine/entity-selection";
import { CANVAS_WRAPPER_ID } from "frontent/pages";
import { TreeFileTabs, TreeTabsType } from "frontent/components";
import { clamp, normalize, applyCSSToElement } from "frontent/utils";
import { useWindowEvent, useDidMount } from "frontent/hooks";

import styles from "./hierarchy.module.scss";
import { MIN_WIDTH_PERCENTAGE, MAX_WIDTH_PERCENTAGE } from "./hierarchy.constants";

export interface HierarchyProps {
  worlds: World[];
  className?: string;
}

export const Hierarchy: React.FC<HierarchyProps> = memo(
  ({ worlds, className = "" }: HierarchyProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // const isInDragRef = useRef(false);
    // const widthPercentageRef = useRef(0);

    useDidMount(() => {
      const container = containerRef.current;
      if (!container) return;
      applyCSSToElement(container, {
        minWidth: MIN_WIDTH_PERCENTAGE + "%",
        maxWidth: MAX_WIDTH_PERCENTAGE + "%",
      });
    });

    // const handleDragZoneDown = (e: React.MouseEvent) => {
    //   e.preventDefault();
    //   isInDragRef.current = true;
    //
    //   const canvasWrapper = document.getElementById(CANVAS_WRAPPER_ID);
    //
    //   const normalized = clamp(
    //     normalize(e.clientX, 0, window.innerWidth) * 100,
    //     MIN_WIDTH_PERCENTAGE,
    //     MAX_WIDTH_PERCENTAGE,
    //   );
    //
    //   applyCSSToElement(containerRef.current, {
    //     width: normalized + "%",
    //   });
    //
    //   applyCSSToElement(canvasWrapper, {
    //     width: 100 - normalized + "%",
    //   });
    // };
    //
    // useWindowEvent("mousemove", (e) => {
    //   if (!isInDragRef.current) return;
    //
    //   const canvasWrapper = document.getElementById(CANVAS_WRAPPER_ID);
    //
    //   const normalized = clamp(
    //     normalize(e.clientX, 0, window.innerWidth) * 100,
    //     MIN_WIDTH_PERCENTAGE,
    //     MAX_WIDTH_PERCENTAGE,
    //   );
    //
    //   applyCSSToElement(containerRef.current, {
    //     width: normalized + "%",
    //   });
    //
    //   applyCSSToElement(canvasWrapper, {
    //     width: 100 - normalized + "%",
    //   });
    // });
    //
    // useWindowEvent("mouseup", () => {
    //   if (!isInDragRef.current) return;
    //   isInDragRef.current = false;
    //   widthPercentageRef.current = 0;
    // });

    const handleOnUncheck = useCallback(() => EntitySelection.select(null), []);

    const tabs: TreeTabsType = worlds.map((world, i) => ({
      name: `World ${i + 1}`,
      content: world.entities.map((entity) => ({
        name: `Entity ${entity.id}`,
        onClick: () => EntitySelection.select(entity),
      })),
    }));

    return (
      <div className={cn(styles.container, className)} ref={containerRef}>
        <div className={styles.header}>Hierarchy</div>
        <TreeFileTabs treeTabs={tabs} onUncheckItem={handleOnUncheck} />
        {/*<div className={styles.dragZone} onMouseDown={handleDragZoneDown} />*/}
      </div>
    );
  },
);

export default Hierarchy;
