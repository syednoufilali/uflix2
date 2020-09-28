import React, { Component } from "react";
import { api, getToken, getRating } from "../util/api";
import Button from "../components/button/button";
import Cockpit from "../components/cockpit/cockpit";
import Modal from "../components/modal/modal";
import "./uploadMovies.css";

export default class UploadMovies extends Component {
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
    }
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
            <input name={"language-" + index} onChange={this.handler}></input>
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
  getFileInputs(n) {
    const FileInputs = [];
    for (let index = 0; index < n; index++) {
      FileInputs.push(
        <div>
          <p>
            Enter Movie Resolution
            <input name={"res-" + index} onChange={this.handler}></input>
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
    const token = getToken();
    const formData = {
      ...this.state
    };
    formData.rating = (await getRating(this.state.title)) || 0;
    formData.modal = null;

    try {
      const response = await api.post("/movies", formData, {
        headers: { authorization: token }
      });
      console.log(response.data);
      alert(`${response.data.result.title} Added Successfully`);
    } catch (error) {
      alert(`${error} Error! Something bad happened`);
      console.log(error);
    }

    this.clearState();
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
      <div className="uploadMovies">
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
