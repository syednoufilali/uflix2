import React from "react";
import Table from "../components/table/table";
import { api, getToken } from "../util/api";
import "./feedback.css";

export default class Feedback extends React.Component {
  state = {
    feedbacks: []
  };

  async componentDidMount() {
    const response = await api.get("/admin/feedback/", {
      headers: {
        authorization: getToken()
      }
    });
    const mappedFeedbacks = response.data.allFeedbacks.map(
      ({ review, ratings, _userId }) => {
        if (_userId) {
          return {
            review,
            ratings,
            email: _userId.email,
            name: _userId.fname + " " + _userId.lname
          };
        } else {
          return {
            review,
            ratings,
            email: null,
            name: null
          };
        }
      }
    );
    this.setState({ feedbacks: mappedFeedbacks });
  }

  clickHandler = () => {};

  render() {
    const columns = [
      {
        Header: "Name",
        headerStyle: { background: "#444" },
        accessor: "name",
        width: 200,
        maxWidth: 200,
        minWidth: 200,
        style: {
          textAlign: "center",
          backgroundColor: "#fff",
          color: "#000"
        }
      },
      {
        Header: "Email",
        headerStyle: { background: "#444" },
        accessor: "email",
        width: 200,
        maxWidth: 200,
        minWidth: 200,
        style: {
          textAlign: "center",
          backgroundColor: "#fff",
          color: "#000"
        }
      },
      {
        Header: "Rating",
        headerStyle: { background: "#444" },
        accessor: "ratings",
        width: 200,
        maxWidth: 200,
        minWidth: 200,
        style: {
          textAlign: "center",
          backgroundColor: "#fff",
          color: "#000"
        }
      },
      {
        Header: "Review",
        headerStyle: { background: "#444" },
        accessor: "review",
        width: 200,
        maxWidth: 400,
        minWidth: 200,
        style: {
          textAlign: "center",
          backgroundColor: "#fff",
          color: "#000"
        }
      }
    ];
    return (
      <div className="feedback">
        <Table
          clickHandler={this.clickHandler}
          columns={columns}
          data={this.state.feedbacks}
        ></Table>
      </div>
    );
  }
}
