import React from "react";
import Slide from "../components/slide/slide";
import { api, getUser, getToken } from "../util/api";
import "./favourate.css";
export default class Home extends React.Component {
  render() {
    return (
      <div className="Favourate">
        <div className="section">
          <Slide
            title={"Favourate Movies"}
            movies={this.props.movies}
            favouriteHandler={this.props.favouriteHandler}
          />
        </div>
      </div>
    );
  }
}
