import React from "react";
import "./hamburger-menu.css";
import { Link } from "react-router-dom";
import logo from "../../images/logo.png";

export default class Hamburger extends React.Component {
  state = {
    open: false
  };
  componentWillUnmount() {
    this.props.clearContext();
  }

  changeMenu = (e, flag) => {
    this.setState({ open: !this.state.open });
    if (!flag) {
      this.props.clearSearch();
    }
  };

  render() {
    const dynamic = this.state.open ? "open-menu" : "close-menu";
    return (
      <React.Fragment>
        <ul id="menu" className={dynamic}>
          {this.state.open ? (
            <ion-icon
              onClick={e => this.changeMenu(e, true)}
              name="close"
            ></ion-icon>
          ) : null}
          <div>
            <img src={logo}></img>
          </div>

          <div className="nav-links">
            <div className="nav-link" onClick={this.changeMenu}>
              <ion-icon name="home"></ion-icon>
              <Link to="/">Home</Link>
            </div>
            <div className="nav-link" onClick={this.changeMenu}>
              <ion-icon name="videocam"></ion-icon>
              <Link to="/movies">Movies</Link>
            </div>
            <div className="nav-link" onClick={this.changeMenu}>
              <ion-icon name="film"></ion-icon>
              <Link to="/demand-movies">Demand Movies</Link>
            </div>
            <div className="nav-link" onClick={this.changeMenu}>
              <ion-icon name="help-buoy"></ion-icon>
              <Link to="/support">Support</Link>
            </div>
            <div className="nav-link" onClick={this.changeMenu}>
              <ion-icon name="volume-high"></ion-icon>
              <Link to="/complaint">Complaint</Link>
            </div>
            <div className="nav-link" onClick={this.changeMenu}>
              <ion-icon name="thumbs-up"></ion-icon>
              <Link to="/feedback">Feedback</Link>
            </div>
            <div className="nav-link" onClick={this.changeMenu}>
              <ion-icon name="log-out"></ion-icon>
              <Link onClick={this.props.signout} to="/">
                SignOut
              </Link>
            </div>
          </div>
        </ul>
        <nav role="navigation">
          <div id="menuToggle">
            <div onClick={e => this.changeMenu(e, true)}>
              <span className="a"></span>
              <span className="b"></span>
              <span className="c"></span>
            </div>

            <div className="ham-search search">
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
          </div>
        </nav>
      </React.Fragment>
    );
  }
}
