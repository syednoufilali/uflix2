import React from "react";
import { Link } from "react-router-dom";

import "./error.css";

export default () => {
  return (
    <div className="error-page">
      <h1>Internal Server Error. Something Went Wrong </h1>
      <p>
        Click Here to redirect to{" "}
        <Link style={{ borderBottom: "2px solid white" }} to="/">
          Homepage
        </Link>
      </p>
    </div>
  );
};
