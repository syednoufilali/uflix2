import React from "react";
import Video from "../components/videoplayer/video";
import "./movie.css";
import { withRouter } from "react-router-dom";
class Movie extends React.Component {
  state = {
    movie: null
  };

  goBack = e => {
    console.log("wow");
    this.props.history.goBack();
  };
  componentDidMount() {
    this.setState({ movie: this.props.history.location.state.movie });
  }
  render() {
    console.log(this.state.movie);
    return (
      <div className="movie">
        {this.state.movie && (
          <Video
            videos={this.state.movie.video}
            languages={this.state.movie.language}
            back={this.goBack}
            poster={this.state.movie.imgLink}
          ></Video>
        )}
      </div>
    );
  }
}

export default withRouter(Movie);
