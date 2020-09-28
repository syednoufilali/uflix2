import React from "react";

import { url, api, getUser, getToken } from "../../util/api";
import { Link } from "react-router-dom";
import Rating from "../rating/rating";
import { withAlert } from "react-alert";
import "./grid-modal.css";

class GridModal extends React.Component {
  state = {
    hasRated: false,
    currentRating: "",
    rating: 0
  };

  selectRatings = rating => {
    const user = getUser();
    this.setState(
      {
        rating,
        hasRated: true
      },
      async () => {
        try {
          const response = await api.patch(
            "/user/movies/rating/" + this.props.movie._id,
            {
              userId: user._id,
              rating: rating
            },
            {
              headers: {
                authorization: getToken()
              }
            }
          );
          this.props.alert.success(response.data.message);
          this.setState(
            {
              currentRating: Number(response.data.movie.userRating)
            },
            () => {
              this.props.fetchMovies();
            }
          );
        } catch (error) {
          const response = { ...error };
          const err = response.response.data;
          this.props.alert.error(err.message);
        }
      }
    );
  };
  componentWillMount() {
    const user = getUser();
    console.log(this.props.movie);
    const matchedIndex = this.props.movie.ratingByUsers.findIndex(obj => {
      return obj.user_id == user._id;
    });
    if (matchedIndex >= 0) {
      this.setState({
        hasRated: true,
        rating: this.props.movie.ratingByUsers[matchedIndex].rating,
        currentRating: this.props.movie.userRating
      });
    } else {
      this.setState({ currentRating: this.props.movie.userRating });
      console.log(this.props.movie.userRating);
    }
  }

  render() {
    const { closeModal, movie } = this.props;
    const { imgLink, description, genre, cast, rating, artwork } = movie;
    return (
      <div className="grid-modal" onDoubleClick={closeModal}>
        <div
          className="cover"
          style={{
            backgroundRepeat: "no-repeat !important",
            backgroundSize: "cover !important",
            backgroundPosition: "center !important",
            backgroundImage: `url(${imgLink})`
          }}
        ></div>
        <div className="backdrop"></div>
        <div className="content">
          <div>
            <div className="text">
              <img
                className="movie-logo"
                alt="movie-title"
                src={url + "/" + artwork}
              ></img>
              <p className="secondary">{description}</p>
            </div>
            <div className="modal-controls-btn">
              <div>
                <ion-icon name="play"></ion-icon>
                <Link
                  to={{
                    pathname: "/movie",
                    state: {
                      movie
                    }
                  }}
                >
                  Play
                </Link>
              </div>
              <div>
                <ion-icon name="heart"></ion-icon>
                <Link>Favourite</Link>
              </div>
            </div>
            <div className="list">
              <span>Rating: </span> {rating + "/10"}
            </div>

            <div className="list">
              <span>Starring: </span> {cast.join(",")}
            </div>
            <div className="list">
              <span>Genre: </span> {genre.join(",")}
            </div>

            <div className="list">
              <span> As rated by Uflix Fans: </span>{" "}
              {Number(this.state.currentRating).toFixed(2)}
            </div>
            <div className="list modal-rating">
              Select Your Rating
              <Rating
                rating={this.state.rating}
                selectRatings={this.selectRatings}
              ></Rating>
            </div>
          </div>
        </div>
        <ion-icon name="close" onClick={closeModal}></ion-icon>
      </div>
    );
  }
}
export default withAlert()(GridModal);
