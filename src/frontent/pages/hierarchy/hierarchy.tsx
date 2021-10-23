import React, { memo, useRef } from "react";
import cn from "classnames";

import { World } from "engine/ecs/world";
import { CANVAS_WRAPPER_ID } from "engine/ui/components/canvas/canvas.constants";
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

    const isInDragRef = useRef(false);
    const widthPercentageRef = useRef(0);

    useDidMount(() => {
      const container = containerRef.current;
      if (!container) return;
      applyCSSToElement(container, {
        minWidth: MIN_WIDTH_PERCENTAGE + "%",
        maxWidth: MAX_WIDTH_PERCENTAGE + "%",
      });
    });

    const handleItemClick = (item: World) => () => {
      console.log("item");
      console.log(item);
    };

    const handleDragZoneDown = (e: React.MouseEvent) => {
      e.preventDefault();
      isInDragRef.current = true;

      const canvasWrapper = document.getElementById(CANVAS_WRAPPER_ID);

      const normalized = clamp(
        normalize(e.clientX, 0, window.innerWidth) * 100,
        MIN_WIDTH_PERCENTAGE,
        MAX_WIDTH_PERCENTAGE,
      );

      applyCSSToElement(containerRef.current, {
        width: normalized + "%",
      });

      applyCSSToElement(canvasWrapper, {
        width: 100 - normalized + "%",
      });
    };

    useWindowEvent("mousemove", (e) => {
      if (!isInDragRef.current) return;

      const canvasWrapper = document.getElementById(CANVAS_WRAPPER_ID);

      const normalized = clamp(
        normalize(e.clientX, 0, window.innerWidth) * 100,
        MIN_WIDTH_PERCENTAGE,
        MAX_WIDTH_PERCENTAGE,
      );

      applyCSSToElement(containerRef.current, {
        width: normalized + "%",
      });

      applyCSSToElement(canvasWrapper, {
        width: 100 - normalized + "%",
      });
    });

    useWindowEvent("mouseup", () => {
      if (!isInDragRef.current) return;
      isInDragRef.current = false;
      widthPercentageRef.current = 0;
    });

    return (
      <div className={cn(styles.container, className)} ref={containerRef}>
        <div className={styles.header}>Hierarchy</div>
        {worlds.map((world, i) => {
          return (
            <div key={i} className={styles.item} onClick={handleItemClick(world)}>
              {`World ${i + 1}`}
            </div>
          );
        })}

        <div className={styles.dragZone} onMouseDown={handleDragZoneDown} />
      </div>
    );
  },
);

export default Hierarchy;
