import React, { FC } from "react";

import { World } from "engine/ecs/world";
import { Hierarchy, Inspector } from "frontent/pages";
import { Canvas } from "./components/canvas";

import styles from "./editor.module.scss";

type Props = {
  worlds: World[];
};

export const Editor: FC<Props> = ({ worlds }) => {
  return (
    <div className={styles.container}>
      <Hierarchy worlds={worlds} />
      <Canvas />
      <Inspector />
    </div>
  );
};
