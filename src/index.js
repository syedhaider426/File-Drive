import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./App.css";
import * as serviceWorker from "./serviceWorker";
import "fontsource-roboto";
import Main from "./main_components/Main";

ReactDOM.render(<Main />, document.getElementById("root"));

//work offline and load faster
serviceWorker.register();
