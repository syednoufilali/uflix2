import React, { Component } from "react";
import { api, getToken } from "../util/api";
import TextInput from "../components/textInput/textInput";
import Button from "../components/button/button";
import Cockpit from "../components/cockpit/cockpit";
import "./updateMovies.css";
import { withRouter } from "react-router-dom";

export default withRouter(
  class UpdateMovie extends Component {
    state = {
      fname: "",
      lname: "",
      password: "",
      email: ""
    };

    componentDidMount = async () => {
      let { id } = this.props.match.params;

      const response = await api.get("/admin/user/" + id, {
        headers: { authorization: getToken() }
      });
      const { fname, lname, password, email } = response.data.user;

      await this.setState({
        fname,
        lname,
        password,
        email
      });
      console.log(this.state);
    };

    handler = e => {
      this.setState({
        [e.target.name]: e.target.value
      });
    };

    submit = async () => {
      const token = getToken();
      const { fname, lname, password, email } = this.state;

      api
        .patch(
          "/admin/user/" + this.props.match.params.id,
          {
            fname,
            lname,
            password,
            email
          },
          {
            headers: { authorization: token }
          }
        )
        .then(response => {
          alert("User was updated");
          this.props.history.push("/user");
        })
        .catch(err => {
          alert("User was not updated");
        });
    };
    render() {
      const { fname, lname, password, email } = this.state;
      return (
        <div className="updateMovies">
          <Cockpit>
            <input
              type="text"
              name="fname"
              onChange={this.handler}
              placeholder="title"
              value={fname}
            ></input>
            <input
              type="text"
              name="lname"
              onChange={this.handler}
              placeholder="Last Name"
              value={lname}
            ></input>
            <input
              type="email"
              name="email"
              onChange={this.handler}
              placeholder="Email"
              value={email}
            ></input>
            <input
              type="password"
              name="password"
              onChange={this.handler}
              placeholder="Password"
              value={password}
            ></input>
            <Button name={"Submit"} submit={this.submit}></Button>
          </Cockpit>
        </div>
      );
    }
  }
);
