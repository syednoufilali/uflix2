import React from "react";
import "./card.css";
import Button from "../button/button";

export default function Card({ title, imgLink, editHandler, deleteHandler }) {
  return (
    <div className="card">
      <div
        style={{
          background: `url(${imgLink})`,
          backgroundSize: "cover",
          width: "100%",
          height: "200px",
          backgroundPosition: "center"
        }}
      ></div>
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
