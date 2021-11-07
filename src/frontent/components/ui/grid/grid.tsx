import React, { memo } from "react";
import cn from "classnames";

import styles from "./grid.module.scss";

export interface GridProps {
  children: React.ReactNode;
  className?: string;
}

export const Grid: React.FC<GridProps> = memo(({ children, className = "" }: GridProps) => {
  const gridStyles = cn(styles.grid, className);

  return (
    <div className={gridStyles}>
      {children}
      {/*<Header title="hello" />*/}
      {/*<DragZone position="top" />*/}
      {/*<DragZone position="right" />*/}
      {/*<DragZone position="bottom" />*/}
      {/*<DragZone position="left" />*/}
    </div>
  );
});

export default Grid;
