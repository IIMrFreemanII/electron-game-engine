import React, { memo } from "react";

import { GameLoop } from "engine";
import { Editor } from "frontent/pages";
import { useDidMount } from "frontent/hooks";
import { useFileGateway } from "gateway";

import styles from "frontent/assets/styles/app.module.scss";

export const App = memo(() => {
  useDidMount(() => {
    const data = {
      filePath: "src/app.tsx",
    };

    useFileGateway(
      window.require("electron").ipcRenderer,
      "readFile",
      data,
      (res, event) => {
        console.log("SUCCESS");
        console.log(event);
        console.log(res);
      },
      (error, event) => {
        console.log("ERROR");
        console.log(event);
        console.log(error);
      },
      (event) => {
        console.log("FINAL");
        console.log(event);
      },
    );
  });

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
