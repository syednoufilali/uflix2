import React from "react";
import Slide from "../components/slide/slide";
import Carousel from "../components/carousel/carousel";
export default function Home() {
  const defaultMovie = {
    title: "John Wick",
    imgLink:
      "https://cnet1.cbsistatic.com/img/QxALxBlQ-AlYD15ijTRpuhdB9E8=/270x0/2017/02/11/f2f82c80-14f0-43f6-b6c6-c49efece96d9/john-wick-2-1-sheet-poster.jpg"
  };
  return (
    <div className="Home">
      <Carousel />
      <Slide title={"Recommended"} movies={new Array(8).fill(defaultMovie)} />
      <Slide title={"Last Added"} movies={new Array(8).fill(defaultMovie)} />
    </div>
  );
}
