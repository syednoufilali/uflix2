import React from "react";
import CustomButton from "../components/button/button";
import TextInput from "../components/textInput/textInput";
import CockPit from "../components/cockpit/cockpit";
import Rating from "../components/rating/rating";
import { api, getUser, getToken } from "../util/api";
import Validator from "validator";
import "./feedback.css";
import { withAlert } from "react-alert";
import { withRouter } from "react-router-dom";
class Feedback extends React.Component {
  state = {
    ratings: 1,
    title: "",
    review: "",
    errors: {
      title: "",
      review: ""
    }
  };

  clearFormState = () => {
    this.setState({ ratings: 1, title: "", review: "" });
  };
  validate = () => {
    const { title, review } = this.state;
    let errors = {};
    if (Validator.isEmpty(Validator.trim(title)))
      errors.title = "Please fill the title field";
    if (Validator.isEmpty(Validator.trim(review)))
      errors.review = "Please fill the review field";

    this.setState({ errors });
    return errors;
  };
  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  selectRatings = ratings => {
    this.setState({
      ratings
    });
  };
  submit = () => {
    const { ratings, title, review } = this.state;
    const { _id } = getUser();
    const token = getToken();
    if (Object.keys(this.validate()).length) return;

    api
      .post(
        "/user/feedback/" + _id,
        { ratings, title, review },
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
      <div className="feedback">
        <CockPit>
          <ion-icon name="thumbs-up"></ion-icon>
          <Rating selectRatings={this.selectRatings} />
          <form>
            <TextInput
              change={this.change}
              value={this.state.title}
              name="title"
              type="text"
              placeholder="Ttile of your review"
            />
            <p className="validation-error">{this.state.errors.title}</p>
            <textarea
              value={this.state.review}
              name="review"
              onChange={this.change}
              rows="5"
              placeholder="Your review here..."
            ></textarea>
            <p className="validation-error"> {this.state.errors.review}</p>

            <CustomButton submit={this.submit} name={"Post your review"} />
          </form>
        </CockPit>
      </div>
    );
  }
}
export default withRouter(withAlert()(Feedback));
