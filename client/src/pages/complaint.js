import React from "react";
import CustomButton from "../components/button/button";
import TextInput from "../components/textInput/textInput";
import CockPit from "../components/cockpit/cockpit";
import { api, getUser, getToken } from "../util/api";
import "./complaint.css";

import Validator from "validator";
import { withAlert } from "react-alert";
import { withRouter } from "react-router-dom";

class Complaint extends React.Component {
  state = {
    subject: "",
    complaint: "",
    errors: {
      subject: "",
      complaint: ""
    }
  };
  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  clearFormState = () => {
    this.setState({ subject: "", complaint: "" });
  };
  submit = () => {
    const { subject, complaint } = this.state;
    const { _id } = getUser();
    const token = getToken();
    if (Object.keys(this.validate()).length) return;
    api
      .post(
        "/user/complaint/" + _id,
        { subject, complaint },
        { headers: { authorization: token } }
      )
      .then(result => {
        this.props.alert.success(result.data.message);
        this.clearFormState();
        this.props.history.push("/");
      })
      .catch(error => {
        const response = { ...error };
        const err = response.response.data;
        this.props.alert.error(err.message);
      });
  };

  validate = () => {
    const { complaint, subject } = this.state;
    let errors = {};
    if (Validator.isEmpty(Validator.trim(complaint)))
      errors.complaint = "Please fill the complaint field";
    if (Validator.isEmpty(Validator.trim(subject)))
      errors.subject = "Please fill the subject field";

    this.setState({ errors });
    return errors;
  };

  render() {
    return (
      <div className="complaint">
        <CockPit>
          <ion-icon name="information-circle"></ion-icon>
          <form>
            <TextInput
              change={this.change}
              value={this.state.subject}
              name="subject"
              type="text"
              placeholder="Subject"
            />
            <p className="validation-error">{this.state.errors.subject}</p>
            <textarea
              onChange={this.change}
              value={this.state.complaint}
              name="complaint"
              rows="5"
              placeholder="Complaint..."
            ></textarea>
            <p className="validation-error">{this.state.errors.complaint}</p>
            <CustomButton submit={this.submit} name={"Submit Complaint"} />
          </form>
        </CockPit>
      </div>
    );
  }
}

export default withRouter(withAlert()(Complaint));
