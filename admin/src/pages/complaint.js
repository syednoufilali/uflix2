import React from "react";
import { getToken, api } from "../util/api";
import Table from "../components/table/table";

import "./complaint.css";

export default class Complaint extends React.Component {
  state = {
    complaints: []
  };

  async componentDidMount() {
    const response = await api.get("/admin/complaint/", {
      headers: {
        authorization: getToken()
      }
    });
    const { allComplaints } = response.data;
    this.setState({ complaints: allComplaints });
  }

  clickHandler = async (row, column) => {
    if (column.Header === "Status") {
      let status = row.original.status === "Completed" ? "New" : "Completed";
      let id = row.original._id;
      const response1 = await api.patch(
        `/admin/complaint/${id}`,
        { status },
        { headers: { authorization: getToken() } }
      );
      const response = await api.get("/admin/complaint/", {
        headers: {
          authorization: getToken()
        }
      });
      const { allComplaints } = response.data;
      this.setState({ complaints: allComplaints });
    }
  };

  render() {
    const columns = [
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
        Header: "Complaint",
        headerStyle: { background: "#444" },
        accessor: "complaint",
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
        Header: "Status",
        headerStyle: { background: "#444" },
        accessor: "status",
        width: 200,
        maxWidth: 200,
        minWidth: 200,
        style: {
          textAlign: "center",
          backgroundColor: "#fff",
          color: "#000"
        },
        Cell: ({ value }) => (
          <span
            style={{
              background:
                value.toLowerCase() == "completed" ? "green" : "orange",
              padding: "7px 15px",
              fontSize: "12px",
              cursor: "pointer",
              borderRadius: "5px"
            }}
          >
            {value}
          </span>
        )
      },
      {
        Header: "Name",
        headerStyle: { background: "#444" },
        accessor: "username",
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
          clickHandler={this.clickHandler}
          columns={columns}
          data={this.state.complaints}
        ></Table>
      </div>
    );
  }
}
