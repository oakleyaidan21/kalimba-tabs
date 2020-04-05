import React, { Component } from "react";

class MenuBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div id="menu-bar" style={styles.mainContainer}>
        <div style={styles.left}>Kalimba Tabs</div>
      </div>
    );
  }
}

const styles = {
  mainContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: 30,
    background: "#34475a",
  },
  left: {},
};

export default MenuBar;
