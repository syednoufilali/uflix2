import React, { Component } from "react";
import { api, getToken } from "../util/api";
import Button from "../components/button/button";
import Cockpit from "../components/cockpit/cockpit";
import { withRouter } from "react-router-dom";
import "./uploadMovies.css";

export default withRouter(
  class AddStaff extends Component {
    state = {
      fname: "",
      lname: "",
      email: "",
      password: "",
      role: "complaint responder",
      confPassword: ""
    };
    handler = e => {
      this.setState({
        [e.target.name]: e.target.value
      });
    };
    submit = async () => {
      const token = getToken();
      const { fname, lname, email, password, role, confPassword } = this.state;
      api
        .post(
          "/staff",
          {
            fname,
            email,
            lname,
            password,
            role,
            confPassword
          },
          {
            headers: { authorization: token }
          }
        )
        .then(response => {
          alert(`${fname} was added to the Staff Panel`);
          this.props.history.push("/staff");
          this.setState({
            fname: "",
            lname: "",
            email: "",
            password: "",
            role: "complaint responder",
            confPassword: ""
          });
        })
        .catch(err => {
          alert(`Staff was not added to the Panel`);
        });
    };
    render() {
      return (
        <div className="uploadMovies">
          <Cockpit>
            <input
              type="text"
              name="fname"
              onChange={this.handler}
              placeholder="First Name"
              value={this.state.fname}
            ></input>
            <input
              type="text"
              name="lname"
              onChange={this.handler}
              placeholder="Last Name"
              value={this.state.lname}
            ></input>
            <input
              type="email"
              name="email"
              onChange={this.handler}
              placeholder="Email"
              value={this.state.email}
            ></input>
            <input
              type="password"
              name="password"
              onChange={this.handler}
              placeholder="Password"
              value={this.state.password}
            ></input>
            <input
              type="password"
              name="confPassword"
              onChange={this.handler}
              placeholder="Confirm Password"
              value={this.state.confPassword}
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
              value={this.state.role}
            >
              <option style={{ color: "#000000" }} value="complaint responder">
                Complaint Responder
              </option>
              <option style={{ color: "#000000" }} value="request responder">
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
