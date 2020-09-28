import React from "react";
import { getToken, api } from "../util/api";
import Table from "../components/table/table";

import "./complaint.css";

export default class DemandMovies extends React.Component {
  state = {
    demands: []
  };

  async componentDidMount() {
    const response = await api.get("/admin/demand/", {
      headers: {
        authorization: getToken()
      }
    });
    const { allDemands } = response.data;
    console.log(allDemands);

    this.setState({ demands: allDemands });
  }
  clickHandler = async (row, column) => {
    if (column.Header === "Status") {
      let status = row.original.status === "Completed" ? false : true;
      let id = row.original._id;
      console.log(status);
      console.log(id);
      await api.patch(
        `/admin/demand/${id}`,
        { status },
        { headers: { authorization: getToken() } }
      );
      const response = await api.get("/admin/demand/", {
        headers: {
          authorization: getToken()
        }
      });
      const { allDemands } = response.data;
      console.log(allDemands);

      this.setState({ demands: allDemands });
    }
  };
  render() {
    const columns = [
      {
        Header: "Title",
        headerStyle: { background: "#444" },
        accessor: "title",
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
        accessor: "status",
        headerStyle: { background: "#444" }, //ok
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
              background: value.toLowerCase() == "completed" ? "green" : "red",
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
          clickHandler={this.clickHandler}
          columns={columns}
          data={this.state.demands}
        ></Table>
      </div>
    );
  }
}
