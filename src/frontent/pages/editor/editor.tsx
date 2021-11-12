import React, { memo, useState,useEffect, useCallback } from "react";

import { World } from "engine";
import { WorldsManager } from "../../../engine/ecs/worlds-manager";
import { Grid } from "frontent/components";
import { Hierarchy, Inspector } from "frontent/pages";
import { Canvas } from "./components/canvas";

import styles from "./editor.module.scss";

export const useWorlds = () => {
  const [worlds, setWorlds] = useState<World[]>([]);

  const handleWorldUpdate = useCallback((worlds: World[]) => {
    setWorlds([...worlds]);
  }, []);

  useEffect(() => {
    WorldsManager.addListener("onWorldsUpdate", handleWorldUpdate);
    return () => WorldsManager.removeListener("onWorldsUpdate", handleWorldUpdate);
  }, []);

  return worlds;
};

export interface EditorProps {}

export const Editor: React.FC<EditorProps> = memo(() => {
  const worlds = useWorlds();

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
