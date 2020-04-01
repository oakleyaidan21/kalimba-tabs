import React, { Component } from "react";

class Note extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      hovered: false
    };
  }
  render() {
    return (
      <div
        style={{
          height: 45,
          marginTop: 5,
          display: "flex",
          backgroundColor:
            this.state.hovered || this.props.isHighlighted ? "yellow" : "",
          justifyContent: "center",
          alignItems: "center"
        }}
        onClick={() => {
          this.setState({ selected: !this.state.selected });
          this.props.onClick(this.state.selected);
        }}
        onMouseEnter={() => {
          this.setState({ hovered: true });
        }}
        onMouseLeave={() => {
          this.setState({ hovered: false });
        }}
      >
        {this.state.selected ? this.props.noteName : ""}
      </div>
    );
  }
}

export default Note;
