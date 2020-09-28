import React from "react";
import CustomButton from "../components/button/button";
import TextInput from "../components/textInput/textInput";
import CockPit from "../components/cockpit/cockpit";
import { api, getUser, getToken } from "../util/api";
import Validator from "validator";
import { withAlert } from "react-alert";
import "./demandMovies.css";
import { withRouter } from "react-router-dom";

class Demand extends React.Component {
  state = {
    titleSuggestion: "",
    review: "",
    errors: {
      titleSuggestion: "",
      review: ""
    }
  };

  clearFormState = () => {
    this.setState({ titleSuggestion: "", review: "" });
  };

  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  validate = () => {
    const { titleSuggestion, review } = this.state;
    let errors = {};
    if (Validator.isEmpty(Validator.trim(titleSuggestion)))
      errors.titleSuggestion = "Please fill the title suggestion field";
    if (Validator.isEmpty(Validator.trim(review)))
      errors.review = "Please fill the review field";

    this.setState({ errors });
    return errors;
  };
  submit = () => {
    const { titleSuggestion, review } = this.state;
    const { _id } = getUser();
    const token = getToken();
    if (Object.keys(this.validate()).length) return;
    api
      .post(
        "/user/demand/" + _id,
        { titles: [titleSuggestion], review },
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
      <div className="demand-movies">
        <CockPit>
          <p>Want to watch your favourte TV Show or Movie on demand?</p>
          <p> Please send us request.</p>
          <form>
            <TextInput
              change={this.change}
              value={this.state.titleSuggestion}
              name="titleSuggestion"
              type="text"
              placeholder="Title Suggestion"
            />
            <p className="validation-error">
              {this.state.errors.titleSuggestion}
            </p>
            <textarea
              onChange={this.change}
              value={this.state.review}
              name="review"
              rows="5"
              placeholder="Your review here..."
            ></textarea>
            <p className="validation-error">{this.state.errors.review}</p>
            <CustomButton name={"Submit Request"} submit={this.submit} />
          </form>
        </CockPit>
      </div>
    );
  }
}
export default withRouter(withAlert()(Demand));
