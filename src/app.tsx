import React, { memo } from "react";

import { GameLoop } from "engine";
import { Editor } from "frontent/pages";
import { useDidMount } from "frontent/hooks";

import styles from "frontent/assets/styles/app.module.scss";

export const App = memo(() => {
  useDidMount(() => {
    GameLoop.init();
    GameLoop.start();
  });

  return (
    <div className={styles.app}>
      <Editor />
    </div>
  );
});
