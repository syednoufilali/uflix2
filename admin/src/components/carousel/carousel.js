import React from "react";
import "./carousel.css";
import image1 from "../../images/1.jpg";
import image2 from "../../images/2.jpg";
import image3 from "../../images/3.jpg";
import image4 from "../../images/4.jpg";
import image5 from "../../images/5.jpg";
import image6 from "../../images/6.jpg";

export default class Carousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [image1, image2, image3, image4, image5, image6],
      interval: 5000,
      current: 0
    };
  }

  intervalHandler = () => {
    let { images, current } = this.state;
    if (current === images.length - 1) current = 0;
    else ++current;
    this.setState({ current });
  };

  componentDidMount() {
    this.timer = setInterval(this.intervalHandler, this.state.interval);
  }

  render() {
    const { images, current } = this.state;

    let controls = images.map((img, idx) => {
      return (
        <div
          onClick={() => {
            this.setState({ current: idx });
          }}
          className={`carousel-control ${idx === current ? "active" : ""}`}
        ></div>
      );
    });

    return (
      <div className="carousel">
        <div
          style={{
            backgroundImage: `url(${images[current]})`,
            position: "relative",
            backgroundSize: "cover"
          }}
          className="carousel-img"
        ></div>
        <div className="carousel-controls">{controls}</div>
      </div>
    );
  }
}
