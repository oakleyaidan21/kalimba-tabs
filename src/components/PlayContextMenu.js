import React, { Component } from "react";
import { FaPlay, FaStop } from "react-icons/fa";

class PlayContextMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div style={styles.mainContainer}>
        {!this.props.isPlaying ? (
          <div>
            <div
              style={styles.row}
              onClick={() => {
                this.props.play(false);
              }}
            >
              <FaPlay />
              <div>From Beginning</div>
            </div>
            <div
              style={styles.row}
              onClick={() => {
                this.props.play(true);
              }}
            >
              <FaPlay />
              <div>From Last Clicked Note</div>
            </div>
          </div>
        ) : (
          <div>
            <div
              style={styles.row}
              onClick={() => {
                this.props.stop();
              }}
            >
              <FaStop />
              Stop
            </div>
          </div>
        )}
      </div>
    );
  }
}

const styles = {
  mainContainer: {
    position: "absolute",
    padding: 10,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    border: "2px solid lightgrey",
    borderRadius: 3,
    top: 20,
    left: 20,
  },
  row: {
    flex: 1,
    whiteSpace: "nowrap",
    width: 200,
    display: "flex",
    margin: 3,
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },
};

export default PlayContextMenu;
