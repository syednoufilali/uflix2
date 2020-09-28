import React from "react";
import logo from "../images/logo.png";
import CockPit from "../components/cockpit/cockpit";
import TextInput from "../components/textInput/textInput";
import CustomButton from "../components/button/button";
import { Link } from "react-router-dom";
import "./signup.css";

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    };
  }

  render() {
    return (
      <div className="signup">
        <CockPit>
          <img src={logo} alt="" />
          <p style={{ fontSize: "26px", textAlign: "center" }}>Sign Up</p>
          <form>
            <TextInput type="text" name="Username" />
            <TextInput type="text" name="Email" />
            <TextInput type="password" name="Password" />
            <TextInput type="password" name="Confirm Password" />
            <CustomButton name={"Next"} />
            <p style={{ textAlign: "center" }}>
              Already Have an account?
              <Link style={{ color: "#c91e1e" }} to="/signin">
                Sign In
              </Link>
            </p>
          </form>
        </CockPit>
      </div>
    );
  }
}
