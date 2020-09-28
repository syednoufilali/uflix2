import React, { createRef } from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";
import logo from "../../images/logo.png";

export default class SideBar extends React.Component {
  state = {
    ddMenu: false
  };
  componentWillUnmount() {
    this.props.clearContext();
  }

  componentDidMount() {
    this.ddMenu = createRef();
  }

  scrollToTop = () => {
    window.scrollTo(0, 0);
  };
  closeDropDownMenu = () => {
    this.scrollToTop();
    this.props.clearSearch();
    this.setState({ ddMenu: false });
  };

  triggerDropDownMenu = () => {
    this.setState({ ddMenu: !this.state.ddMenu });
  };

  render() {
    return (
      <nav className="sidebar" ref={this.props.navbarContext}>
        <div className="nav-logo" onClick={this.closeDropDownMenu}>
          <Link to="/">
            <img src={logo} alt="uflix"></img>
          </Link>
        </div>
        <div className="nav-links">
          <div className="nav-link" onClick={this.closeDropDownMenu}>
            <Link to="/">Home</Link>
          </div>

          <div className="nav-link" onClick={this.closeDropDownMenu}>
            <Link to="/movies">Movies</Link>
          </div>
          <div className="nav-link" onClick={this.closeDropDownMenu}>
            <Link to="/tvshows">TV Shows</Link>
          </div>
          <div className="nav-link" onClick={this.closeDropDownMenu}>
            <Link to="/favourite">Favourite</Link>
          </div>
        </div>
        <div className="nav-control">
          <div className="search">
            <input
              onChange={this.props.change}
              name="search"
              type="text"
              placeholder="Search Movies and TV Shows"
              value={this.props.searchValue}
            ></input>
            <button>
              <ion-icon name="search"></ion-icon>
            </button>
          </div>

          <label className="dropdown">
            <div className="dd-button" onClick={this.triggerDropDownMenu}>
              <ion-icon name="person"></ion-icon>
            </div>

            <ul
              className="dd-menu"
              style={{ display: this.state.ddMenu ? "block" : "none" }}
              ref={this.ddMenu}
            >
              <Link onClick={this.closeDropDownMenu} to="/support">
                Support
              </Link>
              <Link onClick={this.closeDropDownMenu} to="/account">
                Payments
              </Link>
              <Link onClick={this.closeDropDownMenu} to="/complaint">
                Complaint
              </Link>
              <Link onClick={this.closeDropDownMenu} to="/feedback">
                Feedback
              </Link>
              <Link onClick={this.closeDropDownMenu} to="/demand-movies">
                Demand Movies
              </Link>
              <li className="divider"></li>
              <Link onClick={this.props.signout} to="/">
                SignOut
              </Link>
            </ul>
          </label>
        </div>
      </nav>
    );
  }
}
