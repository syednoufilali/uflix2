import React from "react";
import logo from "../images/logo.png";
import CockPit from "../components/cockpit/cockpit";
import TextInput from "../components/textInput/textInput";
import CustomButton from "../components/button/button";
import { api } from "../util/api";
import { Link } from "react-router-dom";
import Validator from "validator";
import { withAlert } from "react-alert";

import "./signin.css";
const scrollToTop = () => {
  window.scrollTo(0, 0);
};
class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {
        email: "",
        password: "",
      },
    };
  }
  change = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  validate = () => {
    const { email, password } = this.state;
    let errors = {};
    if (!Validator.isEmail(Validator.trim(email)))
      errors.email = "Please enter a valid email";
    if (Validator.isEmpty(Validator.trim(email)))
      errors.email = "Please fill the email field";
    if (Validator.isEmpty(Validator.trim(password)))
      errors.password = "Please fill the password field";

    this.setState({ errors });
    return errors;
  };
  submit = async () => {
    const { email, password } = this.state;
    if (Object.keys(this.validate()).length) return;
    try {
      const response = await api.post("/user/login", { email, password });
      if (response.data.success) {
        this.props.alert.success(response.data.message);
        setTimeout(() => {
          this.props.signIn(response.data.currentUser, response.data.token);
        }, 2000);
      } else {
        this.props.alert.error(response.data.message);
      }
    } catch (error) {
      const response = { ...error };
      const err = response.response.data;
      this.props.alert.error(err.message);
    }
  };
  render() {
    return (
      <div className="signin">
        <CockPit>
          <img src={logo} alt="" />
          <p style={{ fontSize: "26px", textAlign: "center" }}>Sign In</p>
          <form>
            <TextInput
              placeholder="Email"
              value={this.state.email}
              change={this.change}
              type="text"
              name="email"
            />
            <p className="validation-error">{this.state.errors.email}</p>
            <TextInput
              placeholder="Password"
              value={this.state.password}
              change={this.change}
              type="password"
              name="password"
            />
            <p className="validation-error">{this.state.errors.password}</p>

            <CustomButton submit={this.submit} name={"Sign In"} />
            <p style={{ textAlign: "center" }}>
              Don't have an account? {"  "}
              <Link style={{ color: "#c91e1e" }} to="/signup">
                Sign Up
              </Link>
            </p>
          </form>
          <ul className="policy-links">
            <li>
              <Link onClick={scrollToTop} to="/policy">
                Privacy &amp; Policy
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

export default withAlert()(SignIn);
