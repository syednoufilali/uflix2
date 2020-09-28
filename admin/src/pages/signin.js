import React from "react";
import logo from "../images/logo.png";
import CockPit from "../components/cockpit/cockpit";
import TextInput from "../components/textInput/textInput";
import CustomButton from "../components/button/button";
import { Link, withRouter } from "react-router-dom";
import { api, getToken } from "../util/api";
import "./signin.css";

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      loginType: "admin"
    };
  }

  genericHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmitHandler = async e => {
    api
      .post(`/${this.state.loginType}/login`, {
        email: this.state.email,
        password: this.state.password
      })
      .then(res => {
        const { token } = res.data;
        localStorage.setItem("admin", JSON.stringify(token));
        if (this.state.loginType == "admin") {
          this.props.setAuth(this.state.loginType);
          localStorage.setItem("role", JSON.stringify(this.state.loginType));
        } else {
          this.props.setAuth(res.data.staff.role);
          localStorage.setItem("role", JSON.stringify(res.data.staff.role));
        }
        this.props.history.push("/");
      })
      .catch(err => {
        alert("error signing in");
      });
  };

  render() {
    return (
      <div className="signin">
        <CockPit>
          <img src={logo} alt="" />
          <p style={{ fontSize: "26px", textAlign: "center" }}>Sign In</p>
          <form>
            <TextInput type="text" name="email" handler={this.genericHandler} />
            <TextInput
              type="password"
              name="password"
              handler={this.genericHandler}
            />
            <CustomButton name={"Sign In"} submit={this.onSubmitHandler} />
          </form>
          <div className="container">
            <span className="sub-container">
              <label htmlFor="admin">Admin</label>
              <input
                onChange={this.genericHandler}
                value="admin"
                type="radio"
                name="loginType"
                id="admin"
              ></input>
            </span>
            <span className="sub-container">
              <label htmlFor="staff">Staff</label>
              <input
                onChange={this.genericHandler}
                value="staff"
                type="radio"
                name="loginType"
                id="staff"
              ></input>
            </span>
          </div>
        </CockPit>
      </div>
    );
  }
}
export default withRouter(SignIn);
