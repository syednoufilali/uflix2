import React from "react";
import "./textInput.css";

export default function textInput({ name, type, handler, value }) {
  return (
    <div className="textInput">
      <input
        id={name}
        type={type}
        name={name}
        placeholder={name}
        onChange={handler}
        value={value}
      ></input>
    </div>
  );
}
