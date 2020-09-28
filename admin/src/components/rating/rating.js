import React from "react";
import "./rating.css";

export default class rating extends React.Component {
  state = {
    stars: [
      "star",
      "star-outline",
      "star-outline",
      "star-outline",
      "star-outline"
    ]
  };

  render() {
    let renderedStars = this.state.stars.map((element, idx) => {
      return (
        <ion-icon
          onClick={e => {
            let rerender = [
              "star",
              "star-outline",
              "star-outline",
              "star-outline",
              "star-outline"
            ];
            rerender.fill("star", 0, idx + 1);
            this.setState({ stars: rerender }, () => {
              console.log(this.state);
            });
          }}
          name={element}
        ></ion-icon>
      );
    });
    return <div className="rating">{renderedStars}</div>;
  }
}
