import React from "react";
import { Route, Switch } from "react-router-dom";
import { SideBar } from "./components/sidebar/sidebar";
import Movies from "./pages/movies";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";

import UploadMovies from "./pages/uploadMovies";
import UpdateMovies from "./pages/updateMovies";
import UpdateStaff from "./pages/updateStaff";
import Complaint from "./pages/complaint";
import Feedback from "./pages/feedback";
import Support from "./pages/support";
import Demand from "./pages/demandMovies";
import Staff from "./pages/staff";
import User from "./pages/users";
import EditUser from "./pages/editUser";
import AddStaff from "./pages/addStaff";
import Media from "./pages/media";
import { getToken, ourLoad, getRole } from "./util/api";
import "./app.css";
import "axios-progress-bar/dist/nprogress.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedin: null,
      role: ""
    };
  }

  componentDidMount() {
    ourLoad();
    let token = getToken();
    let role = getRole();
    if (token) {
      this.setState({ loggedin: true, role });
    }
  }

  setAuth = role => {
    this.setState({ loggedin: true, role });
  };

  clearAuth = () => {
    this.setState({ loggedin: false });
    localStorage.removeItem("admin");
  };

  getAdminRoutes = () => {
    return (
      <Switch>
        {!this.state.loggedin ? (
          <Route exact path="/signup">
            <SignUp />
          </Route>
        ) : null}
        <Route exact path="/">
          <Movies />
        </Route>
        <Route exact path="/staff">
          <Staff />
        </Route>
        <Route exact path="/staff/update/:id" component={UpdateStaff}></Route>
        <Route exact path="/user">
          <User />
        </Route>
        <Route exact path="/user/update/:id" component={EditUser}></Route>
        <Route exact path="/staff/add">
          <AddStaff />
        </Route>
        <Route exact path="/movies/upload">
          <UploadMovies />
        </Route>
        <Route exact path="/movies/update/:id" component={UpdateMovies}></Route>

        <Route exact path="/complaint">
          <Complaint />
        </Route>
        <Route exact path="/feedback">
          <Feedback />
        </Route>
        <Route exact path="/support">
          <Support />
        </Route>
        <Route exact path="/demand-movies">
          <Demand />
        </Route>
        <Route exact path="/media">
          <Media />
        </Route>
        {!this.state.loggedin ? (
          <Route exact path="/">
            <SignIn setAuth={this.setAuth} />
          </Route>
        ) : null}
      </Switch>
    );
  };

  getStaffRoutes = staffRole => {
    return (
      <Switch>
        {!this.state.loggedin ? (
          <Route exact path="/signup">
            <SignUp />
          </Route>
        ) : null}
        <Route exact path="/">
          <Movies />
        </Route>
        {staffRole == "request responder" ? (
          <Route exact path="/demand-movies">
            <Demand />
          </Route>
        ) : (
          <Route exact path="/complaint">
            <Complaint />
          </Route>
        )}
        <Route exact path="/movies/upload">
          <UploadMovies />
        </Route>
        <Route exact path="/movies/update/:id" component={UpdateMovies}></Route>

        <Route exact path="/feedback">
          <Feedback />
        </Route>
        <Route exact path="/support">
          <Support />
        </Route>
        <Route exact path="/media">
          <Media />
        </Route>
        {!this.state.loggedin ? (
          <Route exact path="/">
            <SignIn setAuth={this.setAuth} />
          </Route>
        ) : null}
      </Switch>
    );
  };

  getScreen = () => {
    return (
      <div className="app">
        <SideBar role={this.state.role} clearAuth={this.clearAuth} />
        <div className="screen">
          {this.state.role == "admin"
            ? this.getAdminRoutes()
            : this.getStaffRoutes(this.state.role)}
        </div>
      </div>
    );
  };

  render() {
    {
      return this.state.loggedin ? (
        this.getScreen()
      ) : (
        <div className="app">
          <Route exact path="/">
            <SignIn setAuth={this.setAuth} />
          </Route>
        </div>
      );
    }
  }
}

export default App;
