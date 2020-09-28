import React from "react";
import { Link } from "react-router-dom";
class Navbar extends React.Component {
  state = {
    active: false
  };

  onClickHandler = e => {
    this.setState = { active: !active };
  };

  render() {
    return (
      <nav>
        <a class="menu-btn">
          <span></span>
        </a>
      </nav>
    );
  }
}
