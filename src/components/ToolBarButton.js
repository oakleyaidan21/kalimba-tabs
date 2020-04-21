import React, { Component } from "react";

class ToolBarButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
      beingClicked: false,
      selected: false,
    };
  }
  render() {
    return (
      <div
        style={{
          ...styles.mainContainer,
          border: this.state.hovered ? "1px solid lightgrey" : "",
          backgroundColor:
            this.props.selected || this.state.beingClicked ? "white" : "",
          color: this.props.selected ? "blue" : "black",
          boxShadow:
            this.props.selected || this.state.beingClicked
              ? "inset 0px 1px 3px black"
              : "",
          cursor: this.props.disabled ? "default" : "pointer",
          fontWeight: "bold",
        }}
        onMouseEnter={() => {
          this.setState({ hovered: true });
        }}
        onMouseLeave={() => {
          this.setState({ hovered: false });
          this.setState({ beingClicked: false });
        }}
        onClick={() => {
          if (this.props.disabled) {
            return;
          }
          this.props.onClick();
        }}
        onContextMenu={() => {
          if (this.props.disabled) {
            return;
          }
          this.props.onContextMenu();
        }}
        onMouseDown={() => {
          this.setState({ beingClicked: true });
        }}
        onMouseUp={() => {
          this.setState({ beingClicked: false });
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

let styles = {
  mainContainer: {
    height: 45,
    width: 45,
    borderRadius: 5,
    margin: 1,
    padding: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    whitespace: "nowrap",
  },
};

export default ToolBarButton;
