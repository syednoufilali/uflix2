import React from "react";
import "./button.css";

export default function CustomButton({ name, submit }) {
  return (
    <div className="button" onClick={submit}>
      {name}
    </div>
  );
}
