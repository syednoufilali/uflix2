import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Entry from "./Entry";
import { HashRouter } from "react-router-dom";

import AlertTemplate from "react-alert-template-oldschool-dark";
import { transitions, positions, Provider as AlertProvider } from "react-alert";
const options = {
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: "30px",
  transition: transitions.SCALE
};

ReactDOM.render(
  <AlertProvider template={AlertTemplate} {...options}>
    <HashRouter>
      <Entry />
    </HashRouter>
  </AlertProvider>,
  document.getElementById("root")
);
