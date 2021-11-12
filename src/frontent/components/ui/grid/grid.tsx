import React, { memo, useRef, useCallback, useState } from "react";
import cn from "classnames";

import { handleSetRef, getNodeRect } from "frontent/utils";
import { Nullable } from "frontent/models";
import { GridItem } from "./components/grid-item";
import { initialGridCols, initialGridGap } from "./grid.constants";
import { GridData, GridCalculatedInfo, GridItemRenderCallback } from "./grid.types";

import styles from "./grid.module.scss";

export interface GridProps {
  data: GridData;
  onItemRender: GridItemRenderCallback;
  className?: string;
  cols?: number;
  gap?: number;
}

export const Grid: React.FC<GridProps> = memo(
  ({
    data,
    onItemRender,
    className = "",
    cols = initialGridCols,
    gap = initialGridGap,
  }: GridProps) => {
    const gridRef = useRef<HTMLDivElement>(null);

    const [calculatedInfo, setCalculatedInfo] = useState<Nullable<GridCalculatedInfo>>(null);

    const handleSetDom = useCallback((ref: Nullable<HTMLDivElement>) => {
      if (!ref) return;

      handleSetRef(ref, gridRef);

      const { width, height } = getNodeRect(ref);

      const colWidth = (width - gap * 2) / cols;
      const colHeight = (height - gap * 2) / cols;

      console.log(`{
        colWidth,
        colHeight,
        gap,
      }`);
      console.log({
        colWidth,
        colHeight,
        gap,
      });

      setCalculatedInfo({
        colWidth,
        colHeight,
        gap,
      });
    }, []);

    const gridStyles = cn(styles.grid, "posRel flex1", className);

    return (
      <div className={gridStyles} ref={handleSetDom}>
        {calculatedInfo &&
          data.map((gridItem, i) => (
            <GridItem key={i} index={i} itemData={gridItem} calculatedInfo={calculatedInfo}>
              {onItemRender(i)}
            </GridItem>
          ))}
      </div>
    );
  },
);

export default Grid;
