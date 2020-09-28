import React from "react";
import Card from "../personCard/card";
import "./slide.css";

export default function Slide({ title, staff = [] }) {
  const moviesCard = staff.map(({ name, editHandler, deleteHandler, _id }) => {
    return (
      <Card
        key={_id}
        editHandler={editHandler}
        deleteHandler={deleteHandler}
        title={name}
      />
    );
  });
  return (
    <div className="slide">
      <p>{title}</p>
      <div className="cards">{moviesCard}</div>
    </div>
  );
}
