import React, { Component } from "react";

class SongItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div
        style={styles.songItemContainer}
        onClick={() => {
          this.props.onClick();
        }}
      >
        {this.props.title}
      </div>
    );
  }
}

const styles = {
  songItemContainer: {
    width: 250,
    height: 400,
    margin: 5,
    borderRadius: 10,
    backgroundColor: "lightgrey",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default SongItem;
