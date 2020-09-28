import React from "react";
import { Link } from "react-router-dom";

import "./error.css";

export default () => {
  return (
    <div className="error-page">
      <h1>The page you are trying to find doesn't exists </h1>
      <p>
        Click Here to redirect to your{" "}
        <Link style={{ borderBottom: "2px solid white" }} to="/">
          Homepage
        </Link>
      </p>
    </div>
  );
};
