import React from "react";
import logo from "../images/logo.png";
import CockPit from "../components/cockpit/cockpit";
import TextInput from "../components/textInput/textInput";
import CustomButton from "../components/button/button";
import { Link, withRouter } from "react-router-dom";
import { api } from "../util/api";
import "./signin.css";

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  genericHandler = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmitHandler = e => {
    api
      .post("/staff/login", {
        email: this.state.email,
        password: this.state.password
      })
      .then(async res => {
        console.log(res);
        const { token } = res.data;
        localStorage.setItem("token", JSON.stringify(token));
        this.props.setAuth(res.data.role);
        this.props.history.push("/movies");
      })
      .catch(err => {
        console.log(err);
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
            {/* <p style={{ textAlign: "center" }}>
              Don't have an account?
              <Link style={{ color: "#c91e1e" }} to="/signup">
                Sign Up
              </Link>
            </p> */}
          </form>
        </CockPit>
      </div>
    );
  }
}
export default withRouter(SignIn);
