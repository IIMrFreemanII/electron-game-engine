import * as React from "react";
import ReactDOM from "react-dom";

import { Providers } from "frontent/components";
import { App } from "./app";

ReactDOM.render(
  <Providers>
    <App />
  </Providers>,
  document.getElementById("root"),
);
