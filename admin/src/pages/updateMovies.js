import React, { Component } from "react";
import { api, getToken, getRating } from "../util/api";
import { withRouter } from "react-router-dom";
import Button from "../components/button/button";
import Cockpit from "../components/cockpit/cockpit";
import Modal from "../components/modal/modal";
import "./updateMovies.css";

class UploadMovies extends Component {
  state = {
    title: "",
    description: "",
    genre: "",
    cast: "",
    image: null,
    trailer: null,
    artwork: null,
    rating: 0,
    type: "Movie",
    modal: {
      opened: false,
      data: [],
      parentKaStateName: null
    },
    lang: 0,
    res: 0
  };

  componentDidMount = async () => {
    let { id } = this.props.match.params;

    const response = await api.get("/movies/" + id, {
      headers: { authorization: getToken() }
    });
    console.log(response.data);

    const {
      title,
      description,
      cast,
      genre,
      artwork,
      image,
      trailer,
      language,
      video,
      type
    } = response.data.movie;
    this.setState({
      title,
      description,
      genre: genre.join(" ,"),
      cast: cast.join(" ,"),
      image: image,
      trailer: trailer,
      lang: language.length,
      res: video.length,
      artwork: artwork,
      type: type
    });
    language.forEach((lang, index) => {
      this.setState({
        ["language-file-" + index]: lang.audio,
        ["language-" + index]: lang.language
      });
    });
    video.forEach((vid, index) => {
      this.setState({
        ["res-file-" + index]: vid.video,
        ["res-" + index]: vid.resolution
      });
    });
  };

  handler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handlerFile = e => {
    this.setState({
      [e.target.name]: e.target.files[0]
    });
  };

  getLanugageInputs(n) {
    const languageInputs = [];
    for (let index = 0; index < n; index++) {
      languageInputs.push(
        <div>
          <p>
            Enter Language Name
            <input
              name={"language-" + index}
              value={this.state["language-" + index]}
              onChange={this.handler}
            ></input>
          </p>

          <p>
            Select File
            <Button
              name="Select File"
              submit={e =>
                this.openModal(e, "audios", "language-file-" + index)
              }
            ></Button>
          </p>
          <p>
            {this.state["language-file-" + index]
              ? this.state["language-file-" + index]
              : "Not Selected"}
          </p>
        </div>
      );
    }
    return languageInputs;
  }

  getFileInputs(n) {
    const FileInputs = [];
    for (let index = 0; index < n; index++) {
      FileInputs.push(
        <div>
          <p>
            Enter Movie Resolution
            <input
              name={"res-" + index}
              value={this.state["res-" + index]}
              onChange={this.handler}
            ></input>
          </p>
          <p>
            Select Path
            <Button
              name="Select File"
              submit={e => this.openModal(e, "videos", "res-file-" + index)}
            ></Button>
          </p>
          <p>
            {this.state["res-file-" + index]
              ? this.state["res-file-" + index]
              : "Not Selected"}
          </p>
        </div>
      );
    }
    return FileInputs;
  }

  submit = async () => {
    let { id } = this.props.match.params;
    const token = getToken();
    const formData = {
      ...this.state
    };
    formData.rating = (await getRating(this.state.title)) || 0;
    formData.modal = null;
    console.log(formData);

    try {
      const response = await api.patch("/movies/" + id, formData, {
        headers: { authorization: token }
      });
      alert(`${response.data.updatedMovie.title}  Added Successfully`);
      this.props.history.push("/");
    } catch (error) {
      alert(`${error} Error! Something bad happened`);
    }
  };

  clearState = () => {
    this.setState({
      title: "",
      description: "",
      genre: "",
      cast: "",
      image: null,
      trailer: null,
      artwork: null,
      rating: 0,
      type: "Movie",
      modal: {
        opened: false,
        data: [],
        parentKaStateName: null
      }
    });
  };
  openModal = async (e, type, stateName) => {
    const response = await api.get(`/files/${type}`);
    this.setState({
      modal: {
        opened: true,
        data: response.data,
        parentKaStateName: stateName
      }
    });
  };

  closeModal = e => {
    this.setState({
      modal: {
        opened: false,
        data: [],
        parentKaStateName: null
      }
    });
  };

  changeModalHandler = (e, value) => {
    this.setState({
      [this.state.modal.parentKaStateName]: value
    });
  };

  render() {
    const { title, description, language, cast, genre } = this.state;

    return (
      <div className="updateMovies">
        {this.state.modal.opened ? (
          <Modal
            close={this.closeModal}
            parentState={this.state.modal.parentKaStateName}
            handler={this.changeModalHandler}
            data={this.state.modal.data}
          />
        ) : null}
        <Cockpit>
          <div>
            <p>
              Select No of Resolution
              <input
                min={1}
                onChange={this.handler}
                name="res"
                type="number"
                defaultValue={0}
                value={this.state.res}
              ></input>
            </p>
          </div>
          <div>
            <p>
              Select No of Languages
              <input
                min={1}
                onChange={this.handler}
                name="lang"
                defaultValue={0}
                type="number"
                value={this.state.lang}
              ></input>
            </p>
          </div>
          <React.Fragment>
            {this.getLanugageInputs(this.state.lang)}
          </React.Fragment>
          <React.Fragment>{this.getFileInputs(this.state.res)}</React.Fragment>
          <input
            type="text"
            name="title"
            onChange={this.handler}
            placeholder="title"
            value={title}
          ></input>
          <select
            name="type"
            placeholder="Select File Type"
            onChange={this.handler}
          >
            <option
              selected={this.state.type == "Movie" ? true : false}
              value="Movie"
            >
              Movie
            </option>
            <option
              selected={this.state.type == "TV Show" ? true : false}
              value="TV Show"
            >
              TV Show
            </option>
          </select>
          <input
            type="text"
            name="genre"
            onChange={this.handler}
            placeholder="genre"
            title={genre}
            value={this.state.genre}
          ></input>
          <input
            type="text"
            name="cast"
            onChange={this.handler}
            placeholder="cast"
            value={cast}
          ></input>
          <textarea
            onChange={this.handler}
            name="description"
            rows="5"
            placeholder="description..."
            value={description}
          ></textarea>
          <p>
            Select Thumbnail
            <Button
              name="Select File"
              submit={e => this.openModal(e, "images", "image")}
            ></Button>
            <p>{this.state.image ? this.state.image : "Not Selected"}</p>
          </p>
          <p>
            Select Artwork
            <Button
              name="Select File"
              submit={e => this.openModal(e, "images", "artwork")}
            ></Button>
            <p>{this.state.artwork ? this.state.artwork : "Not Selected"}</p>
          </p>
          <p>
            Select Trailer
            <Button
              name="Select File"
              submit={e => this.openModal(e, "videos", "trailer")}
            ></Button>
            <p>{this.state.trailer ? this.state.trailer : "Not Selected"}</p>
          </p>
          <Button name={"Submit"} submit={this.submit}></Button>
        </Cockpit>
      </div>
    );
  }
}

export default withRouter(UploadMovies);
