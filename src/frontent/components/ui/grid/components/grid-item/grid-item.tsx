import React, { memo } from "react";
import cn from "classnames";

import { GridItemData, GridCalculatedInfo } from "../../grid.types";

import styles from "./grid-item.module.scss";

export interface HeaderProps {
  index: number;
  itemData: GridItemData;
  calculatedInfo: GridCalculatedInfo;
  className?: string;
  children?: React.ReactNode;
}

export const GridItem: React.FC<HeaderProps> = memo(
  ({ index, itemData, calculatedInfo, className = "", children }: HeaderProps) => {
    console.log("itemData + ", index);
    console.log(itemData);

    const { x, y, w, h } = itemData;
    const { colWidth, colHeight, gap } = calculatedInfo;

    const halfW = w / 2;
    const halfH = h / 2;

    // const width = w * colWidth + (Math.floor(halfW) ? Math.ceil(halfW) * gap : 0);
    // const height = h * colHeight + (Math.floor(halfH) ? Math.ceil(halfH) * gap : 0);
    const width = w * colWidth;
    const height = h * colHeight;

    // const gapX = x ? (x - 1) * gap : gap;
    // const gapY = y ? (y - 1) * gap : gap;
    // const gapX = x ? gap + gap : gap;
    // const gapY = y ? gap + gap : gap;
    const gapX = gap;
    const gapY = gap;

    // const gapX = x * gap + gap;
    // const gapY = y * gap + gap;

    const dx = x * colWidth + gapX;
    const dy = y * colHeight + gapY;

    const gridItemInlineStyles: React.CSSProperties = {
      width,
      height,
      transform: `translate(${dx}px, ${dy}px)`,
    };

    const gridItemStyles = cn(styles.gridItem, "dFlex flexDirCol posAbs br1 p1", className);

    return (
      <div className={gridItemStyles} style={gridItemInlineStyles}>
        {children}
      </div>
    );
  },
);

export default GridItem;
