import React from "react";
import Slide from "../components/personSlide/slide";
import { api, getToken } from "../util/api";
import { withRouter } from "react-router-dom";

class Staff extends React.Component {
  state = {
    staff: []
  };

  getStaff = async () => {
    const token = getToken();
    const response = await api.get("/staff", {
      headers: { authorization: token }
    });
    return response.data.staff;
  };

  editHandler = (e, id) => {
    this.props.history.push(`/staff/update/${id}`);
  };
  deleteHandler = async (e, id) => {
    const token = getToken();
    const response = await api.delete(`/staff/${id}`, {
      headers: { authorization: token }
    });
    if (response.data.success) {
      await this.setState({
        staff: this.state.staff.filter(({ _id }) => _id != id)
      });
      alert("staff deleted");
    }
  };

  componentDidMount = async () => {
    const staff = await this.getStaff();
    const renderStaff = staff.map(element => {
      const { fname, lname, email, _id } = element;
      return {
        name: fname + " " + lname,
        email,
        _id,
        editHandler: e => {
          this.editHandler(e, _id);
        },
        deleteHandler: e => {
          this.deleteHandler(e, _id);
        }
      };
    });

    this.setState({
      staff: renderStaff
    });
  };
  render() {
    return (
      <div className="movies">
        <Slide title={"All Staff"} staff={this.state.staff} />
      </div>
    );
  }
}

export default withRouter(Staff);
