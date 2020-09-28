import React from "react";
import { getToken, api } from "../util/api";
import Table from "../components/table/table";

import "./complaint.css";

export default class Support extends React.Component {
  state = {
    support: []
  };

  async componentDidMount() {
    const response = await api.get("/admin/support/", {
      headers: {
        authorization: getToken()
      }
    });
    const { allSupport } = response.data;
    console.log(allSupport);

    this.setState({ support: allSupport });
  }

  render() {
    const columns = [
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
        Header: "Phone",
        headerStyle: { background: "#444" },
        accessor: "phone",
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
        Header: "Subject",
        headerStyle: { background: "#444" },
        accessor: "subject",
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
        Header: "Query",
        headerStyle: { background: "#444" },
        accessor: "query",
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
        Header: "Date",
        headerStyle: { background: "#444" },
        accessor: "createdAt",
        width: 200,
        maxWidth: 200,
        minWidth: 200,
        style: {
          textAlign: "center",
          backgroundColor: "#fff",
          color: "#000"
        }
      }
    ];

    return (
      <div className="complaint">
        <Table
          clickHandler={() => {}}
          columns={columns}
          data={this.state.support}
        ></Table>
      </div>
    );
  }
}
