import React from "react";
import Slide from "../components/slide/slide";
import Carousel from "../components/carousel/carousel";
import { favourateCatagories } from "../util/api";
import "./home.css";
export default class Home extends React.Component {
  render() {
    const slides = favourateCatagories.map((data, idx) => {
      if (idx == 0) {
        return (
          <Slide
            key={idx}
            title={data}
            movies={this.props.movies}
            favouriteHandler={this.props.favouriteHandler}
            fetchMovies={this.props.fetchMovies}
          />
        );
      }
      const slideMovies = this.props.movies.filter(m => {
        return m.genre.includes(data);
      });

      return (
        <Slide
          key={idx}
          title={data}
          movies={slideMovies}
          favouriteHandler={this.props.favouriteHandler}
          fetchMovies={this.props.fetchMovies}
        />
      );
    });
    return (
      <div className="home">
        {this.props.movies.length && (
          <Carousel
            movie={this.props.movies}
            favouriteHandler={this.props.favouriteHandler}
          />
        )}
        <div className="section">{slides}</div>
      </div>
    );
  }
}
