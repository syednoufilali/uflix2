import React from "react";
import Slide from "../components/personSlide/slide";
import { api, getToken } from "../util/api";
import { withRouter } from "react-router-dom";

class Staff extends React.Component {
  state = {
    users: []
  };

  getUsers = async () => {
    const token = getToken();
    const response = await api.get("/admin/user", {
      headers: { authorization: token }
    });
    return response.data.users;
  };

  editHandler = (e, id) => {
    this.props.history.push(`/user/update/${id}`);
  };
  deleteHandler = async (e, id) => {
    const token = getToken();
    const response = await api.delete(`/admin/user/${id}`, {
      headers: { authorization: token }
    });
    if (response.data.success) {
      await this.setState(
        {
          users: this.state.users.filter(({ _id }) => _id != id)
        },
        () => {
          alert("user deleted");
        }
      );
    }
  };

  componentWillMount = async () => {
    const users = await this.getUsers();
    const renderUsers = users.map(element => {
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
      users: renderUsers
    });
  };
  render() {
    return (
      <div className="movies">
        <Slide title={"All Users"} staff={this.state.users} />
      </div>
    );
  }
}

export default withRouter(Staff);
