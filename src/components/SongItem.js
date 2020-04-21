import React, { Component } from "react";
import { FaTrashAlt } from "react-icons/fa";
class SongItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
    };
  }
  render() {
    return (
      <div
        style={styles.songItemContainer}
        onDoubleClick={() => {
          this.props.onClick();
        }}
        onMouseEnter={() => {
          this.setState({ hovered: true });
        }}
        onMouseLeave={() => {
          this.setState({ hovered: false });
        }}
      >
        {/* DELETE BUTTON */}
        {this.state.hovered && (
          <div
            style={styles.deleteButton}
            onClick={() => {
              console.log("clickeroni!");
              //this.props.onDeleteClicked();
            }}
          >
            <FaTrashAlt size={20} />
          </div>
        )}

        {this.props.title.replace(".kal", "")}
      </div>
    );
  }
}

const styles = {
  songItemContainer: {
    width: 250,
    height: 300,
    margin: 5,
    borderRadius: 10,
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    boxShadow: "0px 0px 3px grey",
    fontWeight: "bold",
    position: "relative",
  },
  deleteButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    position: "absolute",
    right: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    top: 10,
  },
};

export default SongItem;
