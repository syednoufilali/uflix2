import React from "react";
import "./card.css";
import Button from "../button/button";

export default function Card({ title, editHandler, deleteHandler }) {
  return (
    <div className="card">
      <ion-icon className="icon" name="contact"></ion-icon>
      <p>{title}</p>
      <Button className="button" name={"Edit"} submit={editHandler}></Button>
      <Button
        className="button"
        name={"Delete"}
        submit={deleteHandler}
      ></Button>
    </div>
  );
}
