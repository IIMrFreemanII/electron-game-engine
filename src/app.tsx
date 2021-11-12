import React, { memo } from "react";

import { Editor } from "frontent/pages";

import styles from "frontent/assets/styles/app.module.scss";

export const App = memo(() => {
  return (
    <div className={styles.app}>
      <Editor />
    </div>
  );
});
