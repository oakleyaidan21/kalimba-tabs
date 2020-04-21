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
          backgroundColor: this.props.selected ? "white" : "",
          color: this.props.selected ? "blue" : "black",
          boxShadow: this.props.selected ? "inset 0px 1px 3px" : "",
          cursor: this.props.disabled ? "default" : "pointer",
        }}
        onMouseEnter={() => {
          this.setState({ hovered: true });
        }}
        onMouseLeave={() => {
          this.setState({ hovered: false });
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
      >
        {this.props.children}
      </div>
    );
  }
}

let styles = {
  mainContainer: {
    height: 50,
    width: 50,
    borderRadius: 5,
    margin: 2,
    padding: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    whitespace: "nowrap",
  },
};

export default ToolBarButton;
