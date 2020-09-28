import React from "react";
import "./button.css";

export default function CustomButton({ name, submit }) {
  return (
    <div onClick={submit} className="button">
      {name}
    </div>
  );
}
