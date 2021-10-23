import React, { FC } from "react";

import { Hierarchy } from "frontent/pages/hierarchy";
import { Canvas } from "../canvas";
import { World } from "../../../ecs/world";

import styles from "./editor.module.scss";

type Props = {
  worlds: World[];
};

export const Editor: FC<Props> = ({ worlds }) => {
  return (
    <div className={styles.container}>
      <Hierarchy worlds={worlds} />
      <Canvas />
    </div>
  );
};
