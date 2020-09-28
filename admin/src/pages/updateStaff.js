import React, { Component } from "react";
import { api, getToken } from "../util/api";
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
      email: "",
      role: ""
    };

    componentDidMount = async () => {
      let { id } = this.props.match.params;

      const response = await api.get("/staff/" + id, {
        headers: { authorization: getToken() }
      });
      const { fname, lname, password, email, role } = response.data.staff;

      this.setState({
        fname,
        lname,
        password,
        email,
        role
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
      const { fname, lname, password, email, role } = this.state;

      api
        .patch(
          "/staff/" + this.props.match.params.id,
          {
            fname,
            lname,
            password,
            email,
            role
          },
          {
            headers: { authorization: token }
          }
        )
        .then(response => {
          alert("Staff was updated");

          this.setState({
            fname: "",
            lname: "",
            password: "",
            email: "",
            role: ""
          });
          this.props.history.push("/staff");
        })
        .catch(err => {
          alert("Staff was not updated");
          console.clear();
          console.log(err);
        });
    };
    render() {
      const { fname, lname, password, email, role } = this.state;
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
            <select
              type="text"
              name="role"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "none",
                fontSize: 20,
                padding: 10,
                borderRadius: 5
              }}
              onChange={this.handler}
              placeholder="Role"
            >
              <option
                selected={this.state.role === "complaint responder"}
                style={{ color: "#000000" }}
                value="complaint responder"
              >
                Complaint Responder
              </option>
              <option
                selected={this.state.role === "request responder"}
                style={{ color: "#000000" }}
                value="request responder"
              >
                Request Responder
              </option>
            </select>
            <Button name={"Submit"} submit={this.submit}></Button>
          </Cockpit>
        </div>
      );
    }
  }
);
