import React, { Component } from "react";

class ScreenWideModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div style={styles.mainContainer}>
        <div style={styles.modal}>{this.props.children}</div>
      </div>
    );
  }
}

const styles = {
  mainContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(200,200,200,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    width: 400,

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    border: "2px solid black",
    borderRadius: 3,
    zIndex: 1001,
    padding: 10,
  },
};

export default ScreenWideModal;
