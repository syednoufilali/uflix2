import React from "react";
import "./loader.css";
import loaderScreen from "../../images/loader.gif";

export default () => {
  return (
    <div className="loader-container">
      <div id="loader" class="nfLoader"></div>
    </div>
  );
};
