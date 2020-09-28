import React from "react";
import "./textInput.css";

export default function textInput({ name, type,change,value,placeholder }) {
  return (
    <div className="textInput">
      <input onChange={change} value={value} name={name} id={name} type={type} placeholder={placeholder}></input>
    </div>
  );
}
