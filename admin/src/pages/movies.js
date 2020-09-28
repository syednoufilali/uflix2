import React from "react";
import Slide from "../components/slide/slide";
import { api, BASE_URL, getToken } from "../util/api";
import { withRouter } from "react-router-dom";

class Movies extends React.Component {
  state = {
    movies: []
  };

  getAllMovies = async () => {
    const token = getToken();
    const response = await api.get("/movies", {
      headers: { authorization: token }
    });
    return response.data.movies;
  };

  editHandler = (e, id) => {
    this.props.history.push(`/movies/update/${id}`);
  };
  deleteHandler = async (e, id) => {
    const token = getToken();
    const response = await api.delete(`/movies/${id}`, {
      headers: { authorization: token }
    });

    if (response.data.success) {
      await this.setState({
        movies: this.state.movies.filter(({ _id }) => _id != id)
      });
      alert("movie deleted");
    }
  };

  componentDidMount = async () => {
    const movies = await this.getAllMovies();
    const renderMovies = movies.map(element => {
      const imgLink = BASE_URL + element.image;
      console.log(imgLink);

      const { title, _id } = element;
      return {
        title,
        _id,
        imgLink,
        editHandler: e => {
          this.editHandler(e, _id);
        },
        deleteHandler: e => {
          this.deleteHandler(e, _id);
        }
      };
    });

    this.setState({
      movies: renderMovies
    });
  };
  render() {
    return (
      <div className="movies">
        <Slide title={"All movies"} movies={this.state.movies} />
      </div>
    );
  }
}

export default withRouter(Movies);
