import React from "react";
import logo from "../images/logo.png";
import CockPit from "../components/cockpit/cockpit";
import TextInput from "../components/textInput/textInput";
import CustomButton from "../components/button/button";
import { api } from "../util/api";
import { Link } from "react-router-dom";
import "./signup.css";
import Validator from "validator";

const scrollToTop = () => {
  window.scrollTo(0, 0);
};
export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      email: "",
      password: "",
      confirmPassword: "",

      errors: {
        fname: "",
        lname: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
    };
  }

  change = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  submit = () => {
    const { steps, ...rest } = this.state;
    if (Object.keys(this.validateFirst()).length) return;
    api
      .post("/user/", { ...rest })
      .then((result) => {
        console.log(result);
        alert("User has been registered");
      })
      .catch((err) => {
        alert("User has not been registered");
        console.log(err);
      });
  };
  validateFirst = () => {
    const { email, password, confirmPassword, fname, lname } = this.state;
    let errors = {};
    if (!Validator.isEmail(Validator.trim(email)))
      errors.email = "Please enter a valid email";
    if (Validator.isEmpty(Validator.trim(fname)))
      errors.fname = "Please enter a valid first name";
    if (Validator.isEmpty(Validator.trim(lname)))
      errors.lname = "Please enter a valid last name";
    if (Validator.isEmpty(Validator.trim(email)))
      errors.email = "Please fill the email field";
    if (!Validator.isLength(Validator.trim(password), { min: 6, max: 16 }))
      errors.password = "Password Field must 6 - 16 digits";
    if (Validator.isEmpty(Validator.trim(password)))
      errors.password = "Please fill the password field";
    if (password.trim() != confirmPassword.trim())
      errors.confirmPassword = "confirm password should match";
    this.setState({ errors });
    return errors;
  };

  render() {
    return (
      <div className="signup">
        <CockPit>
          <img src={logo} alt="" />
          <p style={{ fontSize: "26px", textAlign: "center" }}>
            Please Enter Details
          </p>

          <form>
            <React.Fragment>
              <TextInput
                placeholder="First Name"
                value={this.state.fname}
                change={this.change}
                type="text"
                name="fname"
              />
              <p>{this.state.errors.fname}</p>
              <TextInput
                placeholder="Last Name"
                value={this.state.lname}
                change={this.change}
                type="text"
                name="lname"
              />
              <p>{this.state.errors.lname}</p>
              <TextInput
                placeholder="Email"
                value={this.state.email}
                change={this.change}
                type="text"
                name="email"
              />
              <p>{this.state.errors.email}</p>
              <TextInput
                placeholder="Password"
                value={this.state.password}
                change={this.change}
                type="password"
                name="password"
              />
              <p>{this.state.errors.password}</p>
              <TextInput
                placeholder="Confirm Password"
                value={this.state.confirmPassword}
                change={this.change}
                type="password"
                name="confirmPassword"
              />
              <p>{this.state.errors.confirmPassword}</p>
              <CustomButton name={"Sign Up"} submit={this.submit} />
            </React.Fragment>

            <p style={{ textAlign: "center" }}>
              Already Have an account?
              <Link style={{ color: "#c91e1e", marginLeft: "10px" }} to="/">
                Sign In
              </Link>
            </p>
          </form>
          <ul className="policy-links">
            <li>
              <Link onClick={scrollToTop} to="/policy">
                Privacy & Policy
              </Link>
            </li>
            <li>
              <Link onClick={scrollToTop} to="/refund_policy">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link onClick={scrollToTop} to="/term_of_use">
                Term Of Use
              </Link>
            </li>
          </ul>
        </CockPit>
      </div>
    );
  }
}
