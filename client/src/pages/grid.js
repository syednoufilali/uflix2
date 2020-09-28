import React from "react";
import Card from "../components/card/card";
import GridModal from "../components/grid-modal/grid-modal";

import { catagories } from "../util/api";
import "./grid.css";
export default class Grid extends React.Component {
  state = {
    filter: "",
    indexOfModal: -1,
    selectedIndex: -1,
    movies: []
  };

  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  getGenreFilter = (movies, filter) => {
    if (!this.state.filter) return movies;
    return movies.filter(m => {
      const genre = m.genre.map(g => g.trim());
      return genre.includes(filter);
    });
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.navbar.current.style.position = "relative";
    this.setState({ movies: this.props.movies });
  }

  componentWillUnmount() {
    this.props.navbar.current.style.position = "fixed";
  }

  config = [
    [768, 1],
    [1366, 6],
    [1600, 6],
    [1920, 6]
  ];

  openModal = (e, idx) => {
    console.log("window.innerWidth", window.innerWidth);

    let rowItems = 6;
    for (let index = 0; index < this.config.length; index++) {
      if (window.innerWidth <= this.config[index][0]) {
        rowItems = this.config[index][1];
        break;
      }
    }
    console.log("Row Items", rowItems);
    let movies = this.getGenreFilter(this.props.movies, this.state.filter);
    let row = parseInt(idx) / rowItems + 1;
    console.log("Row", row);
    let indexToAdd = row * rowItems - 1;
    console.log("indexToAdd", indexToAdd);

    this.setState(
      { movies, indexOfModal: indexToAdd + 1, selectedIndex: idx },
      () => {
        console.log(this.state);
      }
    );
  };

  closeModal = e => {
    this.setState({
      selectedIndex: -1,
      indexOfModal: -1
    });
  };

  render() {
    const customCatagories = catagories.map(catagory => (
      <option value={catagory == "Select" ? "" : catagory}>{catagory}</option>
    ));
    let before = [];
    let after = [];

    let filteredMovies = this.getGenreFilter(
      this.props.movies,
      this.state.filter
    );
    let movieCards = filteredMovies.map((movie, idx) => {
      return (
        <Card
          key={"" + idx}
          movie={movie}
          openModal={e => this.openModal(e, idx)}
          favouriteHandler={this.props.favouriteHandler}
        />
      );
    });

    if (this.state.indexOfModal >= 0) {
      const modal = [
        <GridModal
          closeModal={this.closeModal}
          movie={filteredMovies[this.state.selectedIndex]}
          fetchMovies={this.props.fetchMovies}
        ></GridModal>
      ];
      before = movieCards.slice(0, this.state.indexOfModal);
      after = movieCards.slice(
        this.state.indexOfModal + 1,
        movieCards.length - 1
      );
      movieCards = [...before, ...modal, ...after];
      console.warn(movieCards);
    }

    return (
      <div className="grid">
        <div className="header">
          <h1 className="title">{this.props.name}</h1>
          <select className="catagories" name="filter" onChange={this.change}>
            {customCatagories}
          </select>
        </div>
        <div className="section">
          <div className="grid-cards">{movieCards}</div>
        </div>
      </div>
    );
  }
}
