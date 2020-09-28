import React from "react";

import CockPit from "../components/cockpit/cockpit";
import { withRouter } from "react-router-dom";

import logo from "../images/logo.png";
import { api, getUser, getToken, setUser, url } from "../util/api";
import "./account.css";
import { withAlert } from "react-alert";

class Account extends React.Component {
  state = {};
  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onToggleSwitchChange = () => {
    this.setState({ willPay: !this.state.willPay });
  };
  render() {
    return (
      <div className="account">
        <CockPit>
          {this.props.isBlock ? <img src={logo} alt="" /> : null}
          <ion-icon name="card"></ion-icon>
          <form id="myCCForm">
            <p>Show payment history </p>
          </form>
        </CockPit>
      </div>
    );
  }
}

export default withRouter(withAlert()(Account));
