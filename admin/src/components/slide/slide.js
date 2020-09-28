import React from "react";
import Card from "../card/card";
import "./slide.css";

export default function Slide({ title, movies = [] }) {
  const moviesCard = movies.map(
    ({ title, imgLink, editHandler, deleteHandler, _id }) => {
      return (
        <Card
          key={_id}
          editHandler={editHandler}
          deleteHandler={deleteHandler}
          title={title}
          imgLink={imgLink}
        />
      );
    }
  );
  return (
    <div className="slide">
      <p>{title}</p>
      <div className="cards">{moviesCard}</div>
    </div>
  );
}
