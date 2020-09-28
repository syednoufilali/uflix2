import React from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";
import logo from "../../images/logo.png";
export const SideBar = ({ clearAuth, role }) => {
  return (
    <nav className="sidebar">
      <div className="nav-logo">
        <img src={logo} alt="uflix"></img>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link">
          <ion-icon name="videocam"></ion-icon>
          <p>Movies</p>
        </Link>
        {role == "admin" ? (
          <React.Fragment>
            <Link to="/staff" className="nav-link">
              <ion-icon name="person"></ion-icon>
              <p>Staff</p>
            </Link>
            <Link to="/user" className="nav-link">
              <ion-icon name="contacts"></ion-icon>
              <p>Users</p>
            </Link>
            <Link to="/staff/add" className="nav-link">
              <ion-icon name="add"></ion-icon>
              <p>Add Staff</p>
            </Link>
          </React.Fragment>
        ) : null}
        {role == "admin" || role == "request responder" ? (
          <Link to="/demand-movies" className="nav-link">
            <ion-icon name="film"></ion-icon>
            <p>Demand Movies</p>
          </Link>
        ) : null}
        {role == "admin" || role == "complaint responder" ? (
          <Link to="/complaint" className="nav-link">
            <ion-icon name="volume-high"></ion-icon>
            <p>Complaint</p>
          </Link>
        ) : null}
        <Link to="/support" className="nav-link">
          <ion-icon name="help-buoy"></ion-icon>
          <p>Support</p>
        </Link>
        <Link to="/feedback" className="nav-link">
          <ion-icon name="thumbs-up"></ion-icon>
          <p>Feedback</p>
        </Link>
        <Link to="/movies/upload" className="nav-link">
          <ion-icon name="disc"></ion-icon>
          <p>Add Movie</p>
        </Link>
        <Link to="/media" className="nav-link">
          <ion-icon name="cloud-upload"></ion-icon>
          <p>Media</p>
        </Link>
        <Link to="/" className="nav-link" onClick={clearAuth}>
          <ion-icon name="help-buoy"></ion-icon>
          <p>SignOut</p>
        </Link>
      </div>
    </nav>
  );
};
