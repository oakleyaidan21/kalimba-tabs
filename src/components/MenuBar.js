import React, { Component } from "react";
import {
  FaBars,
  FaWindowClose,
  FaWindowMinimize,
  FaWindowMaximize,
} from "react-icons/fa";
import * as Menu from "../menu-functions";

class MenuBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div style={styles.mainContainer}>
        <div style={styles.left}>
          <MenuButton
            icon={<FaBars />}
            hoverColor="#91bfff"
            menuFunction={() => {
              Menu.openMenu();
            }}
          />
        </div>
        <div style={styles.middle}>Kalimba Tabs</div>
        <div style={styles.right}>
          <MenuButton
            icon={<FaWindowMinimize />}
            hoverColor="#91bfff"
            menuFunction={() => {
              Menu.minimizeWindow();
            }}
          />
          <MenuButton
            icon={<FaWindowMaximize />}
            hoverColor="#91bfff"
            menuFunction={() => {
              Menu.maximizeWindow();
            }}
          />
          <MenuButton
            icon={<FaWindowClose />}
            hoverColor="red"
            menuFunction={() => {
              Menu.closeWindow();
            }}
          />
        </div>
      </div>
    );
  }
}

class MenuButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: "",
    };
  }
  render() {
    return (
      <div
        style={{
          flex: 1,
          backgroundColor: this.state.backgroundColor,
          color: "white",
          paddingLeft: 10,
          paddingRight: 10,
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
        onMouseEnter={() => {
          this.setState({
            backgroundColor: this.props.hoverColor,
          });
        }}
        onMouseLeave={() => {
          this.setState({ backgroundColor: "" });
        }}
        onClick={() => {
          this.props.menuFunction();
        }}
      >
        {this.props.icon}
      </div>
    );
  }
}

const styles = {
  mainContainer: {
    display: "flex",
    justifyContent: "space-between",
    height: 30,
    background: "#60a1fc",
  },
  left: { color: "white", fontWeight: "bold", width: 100 },
  middle: {
    flex: 1,
    color: "white",
    padding: 5,
    fontWeight: "bold",
    WebkitAppRegion: "drag",
  },
  right: {
    display: "flex",
    justifyContent: "space-between",
    width: 100,
    marginRight: 9,
  },
};

export default MenuBar;
