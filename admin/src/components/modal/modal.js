import React from "react";
import "./modal.css";

export default class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null
    };
  }

  render() {
    const { data, close, handler } = this.props;
    const files = data.map(d => {
      return (
        <li
          onClick={e => {
            handler(e, d.path);
            this.setState({ selected: d.path });
          }}
        >
          <label
            className={d.path == this.state.selected ? "active" : "inactive"}
          >
            {d.name}
          </label>
        </li>
      );
    });
    return (
      <div className="modal">
        <div className="modal-control" onClick={close}>
          CLOSE
        </div>
        <ul>{files}</ul>
      </div>
    );
  }
}
