import React from "react";
import CustomButton from "../components/button/button";
import TextInput from "../components/textInput/textInput";
import CockPit from "../components/cockpit/cockpit";
import { api, getUser, getToken } from "../util/api";
import "./support.css";
import { withAlert } from "react-alert";
import Validator from "validator";
import { withRouter } from "react-router-dom";

class Support extends React.Component {
  state = {
    phone: "+92",
    subject: "",
    query: "",
    errors: { phone: "", subject: "", query: "" }
  };

  clearFormState = () => {
    this.setState({ phone: "+92", subject: "", query: "" });
  };

  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  validate = () => {
    const { phone, subject, query } = this.state;
    let errors = {};
    if (Validator.isEmpty(Validator.trim(query)))
      errors.query = "Please fill the complaint field";
    if (Validator.isEmpty(Validator.trim(subject)))
      errors.subject = "Please fill the subject field";
    if (
      !phone.match(
        /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/
      )
    )
      errors.phone = "Please enter a valid phone number";
    if (Validator.isEmpty(Validator.trim(phone)))
      errors.phone = "Please fill the phone field";

    this.setState({ errors });
    return errors;
  };
  submit = () => {
    const { subject, phone, query } = this.state;
    const { _id } = getUser();
    const token = getToken();
    if (Object.keys(this.validate()).length) return;

    api
      .post(
        "/user/support/" + _id,
        { subject, phone, query },
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
  render() {
    return (
      <div className="support">
        <CockPit>
          <ion-icon name="quote"></ion-icon>
          <form>
            <TextInput
              type="text"
              name="phone"
              change={this.change}
              value={this.state.phone}
              placeholder="Phone"
            />
            <p className="validation-error">{this.state.errors.phone}</p>
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
              name="query"
              value={this.state.query}
              rows="5"
              placeholder="Your Query..."
            ></textarea>
            <p className="validation-error">{this.state.errors.query}</p>
            <CustomButton name={"get support"} submit={this.submit} />
          </form>
        </CockPit>
      </div>
    );
  }
}

export default withRouter(withAlert()(Support));
