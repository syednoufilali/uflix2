import React from "react";
import "./card.css";
import { url } from "../../util/api";
import { Link } from "react-router-dom";

export default class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      muted: true,
      playing: false
    };
    this.video = React.createRef();
    this.card = React.createRef();
  }

  voulmeHandler = e => {
    this.state.muted
      ? (this.video.current.muted = false)
      : (this.video.current.muted = true);
    this.setState({ muted: !this.state.muted });
  };

  mouseEnterHandler = e => {
    this.video.current.play();
  };
  mouseLeaveHandler = e => {
    this.video.current.pause();
  };

  doNothing() {}
  render() {
    const {
      title,
      imgLink,
      description,
      genre,
      cast,
      _id,
      language,
      video
    } = this.props.movie;
    return (
      <div
        to={{
          pathname: "/movie",
          state: {
            title,
            imgLink,
            description,
            genre,
            cast,
            _id,
            language,
            video
          }
        }}
        className="card"
        ref={this.card}
        onMouseEnter={this.mouseEnterHandler}
        onMouseLeave={this.mouseLeaveHandler}
      >
        <div className="backdrop"></div>
        <div
          className="card-simple"
          style={{
            backgroundImage: `url(${imgLink})`,
            backgroundRepeat: "none",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        ></div>
        <div className="card-hover">
          <video
            ref={this.video}
            muted
            loop
            src={url + "/" + this.props.movie.trailer}
          ></video>
        </div>
        <div className="card-hover-controls">
          <div className="column">
            <Link
              to={{
                pathname: "/movie",
                state: {
                  movie: this.props.movie
                }
              }}
            >
              <ion-icon name="play-circle"></ion-icon>
            </Link>
            <p className="title">{title}</p>
            <p className="genre">{genre.join(" , ")}</p>
          </div>
          <div className="column">
            {!this.state.muted ? (
              <ion-icon
                onClick={this.voulmeHandler}
                name="volume-high"
              ></ion-icon>
            ) : (
              <ion-icon
                onClick={this.voulmeHandler}
                name="volume-off"
              ></ion-icon>
            )}
            {this.props.movie.isFav ? (
              <ion-icon
                name="heart"
                onClick={e => this.props.favouriteHandler(e, this.props.movie)}
              ></ion-icon>
            ) : (
              <ion-icon
                name="heart-empty"
                onClick={e => this.props.favouriteHandler(e, this.props.movie)}
              ></ion-icon>
            )}
          </div>
        </div>
        <ion-icon
          name="arrow-dropdown"
          onClick={this.props.openModal}
        ></ion-icon>
      </div>
    );
  }
}
