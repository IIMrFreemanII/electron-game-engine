import * as React from "react";
import ReactDOM from "react-dom";

import { Providers } from "frontent/components/client/providers";
import { App } from "./app";

import "frontent/assets/styles/index.scss";

ReactDOM.render(
  <Providers>
    <App />
  </Providers>,
  document.getElementById("root"),
);
