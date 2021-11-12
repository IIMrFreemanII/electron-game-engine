import React, { useCallback, useEffect, useState } from "react";

import { Hierarchy, Inspector } from "frontent/pages";
import { Canvas } from "./components/canvas";

import styles from "./editor.module.scss";
import { WorldsManager } from "../../../engine/ecs/worlds-manager";
import { World } from "../../../engine";

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

export const Editor: React.FC<EditorProps> = () => {
  const worlds = useWorlds();

  return (
    <div className="col p1">
      <div className="row">
        <div className="col2">
          <Hierarchy worlds={worlds} />
        </div>
        <div className="col8">
          <Canvas />
        </div>
        <div className="col2">
          <Inspector />
        </div>
      </div>
    </div>
  );
};

export default Editor;
