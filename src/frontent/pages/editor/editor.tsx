import React, { memo, useState, useCallback } from "react";

import { World } from "engine";
import { Grid } from "frontent/components";
import { Hierarchy, Inspector } from "frontent/pages";
import { Canvas } from "./components/canvas";

import styles from "./editor.module.scss";

export interface EditorProps {
  worlds: World[];
}

export const Editor: React.FC<EditorProps> = memo(({ worlds }: EditorProps) => {
  const [gridData, setGridData] = useState([
    { x: 0, y: 0, w: 12, h: 1 },
    { x: 0, y: 1, w: 6, h: 1 },
    { x: 6, y: 1, w: 6, h: 1 },
    { x: 0, y: 2, w: 1, h: 1 },
    { x: 1, y: 2, w: 1, h: 2 },
    { x: 2, y: 2, w: 1, h: 2 },
    { x: 0, y: 3, w: 1, h: 2 },
    { x: 0, y: 5, w: 1, h: 3 },
    { x: 0, y: 8, w: 1, h: 2 },
    { x: 3, y: 2, w: 2, h: 3 },
    { x: 1, y: 4, w: 2, h: 1 },
    { x: 1, y: 5, w: 4, h: 4 },
    { x: 9, y: 2, w: 3, h: 10 },
  ]);

  const handleRenderItem = useCallback((index: number) => {
    return (
      <>
        <div>{index}</div>
        <div>
          {Object.entries(gridData[index]).map(([key, value]) => {
            return (
              <div>
                {key}: {value}
              </div>
            );
          })}
        </div>
      </>
    );
  }, []);

  return <Grid data={gridData} onItemRender={handleRenderItem} />;

  return (
    <div className="col p1">
      <div className="row gapCol1">
        <div className="col2">
          <Hierarchy worlds={worlds} />
        </div>
        <div className="dFlex p5 m0 flex1 flexDirCol col3">hello</div>
        <div className="col">
          <Canvas />
        </div>
        <div className="col3">
          <Inspector />
        </div>
      </div>
    </div>
  );
});

export default Editor;
