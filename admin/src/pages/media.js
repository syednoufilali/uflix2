import React, { Component } from "react";
import { api, BASE_URL, getToken } from "../util/api";
import Button from "../components/button/button";
import Cockpit from "../components/cockpit/cockpit";
import "react-dropzone-uploader/dist/styles.css";
import Dropzone from "react-dropzone-uploader";

import "./media.css";

export default class UploadMovies extends Component {
  getUploadParams = ({ meta }) => {
    return {
      url: BASE_URL + "files",
      headers: {
        authorization: getToken()
      }
    };
  };

  // called every time a file's `status` changes
  handleChangeStatus = ({ meta, file }, status) => {
    console.log(status, meta, file);
  };

  // receives array of files that are done uploading when submit button is clicked
  handleSubmit = (files, allFiles) => {
    console.log(files.map(f => f.meta));
    allFiles.forEach(f => f.remove());
  };
  render() {
    return (
      <div className="media">
        <Cockpit>
          <Dropzone
            getUploadParams={this.getUploadParams}
            onChangeStatus={this.handleChangeStatus}
            onSubmit={this.handleSubmit}
            accept="image/*,audio/*,video/*"
          />
        </Cockpit>
      </div>
    );
  }
}
