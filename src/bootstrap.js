import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./components/app";

import "./style/main.scss";

function main() {
  ReactDOM.render(<App />, document.querySelector(".app-wrapper"));
}

document.addEventListener("DOMContentLoaded", main);
