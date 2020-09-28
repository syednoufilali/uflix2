import React from "react";
import "./switch.css";

export default function(props) {
  return (
    <div className="ToggleSwitch ToggleSwitch__rounded">
      <div className="ToggleSwitch__wrapper">
        <div
          className={`Slider ${props.checked && "isChecked"}`}
          onClick={props.onToggleSwitchChange}
        ></div>
      </div>
    </div>
  );
}
