import React, { memo } from "react";

import { World } from "engine";
import { Hierarchy, Inspector } from "frontent/pages";
import { Canvas } from "./components/canvas";

import styles from "./editor.module.scss";

export interface EditorProps {
  worlds: World[];
}

export const Editor: React.FC<EditorProps> = memo(({ worlds }: EditorProps) => {
  return (
    <div className="col p1">
      <div className="row gapCol1">
        <div className="col2">
          <Hierarchy worlds={worlds} />
        </div>
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
