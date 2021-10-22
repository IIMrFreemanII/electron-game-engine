import { Canvas } from "../canvas";
import React, { FC } from "react";
import { World } from "../../../ecs/world";

import "./index.css";

type Props = {
  worlds: World[];
};

export const Editor: FC<Props> = ({ worlds }) => {
  return (
    <div className="editor">
      <div className="hierarchy">
        <div className="hierarchy-header">Hierarchy</div>
        {worlds.map((world, i) => {
          return <div key={i} className="hierarchy-item">{`World ${i + 1}`}</div>;
        })}
      </div>
      <Canvas />
    </div>
  );
};
