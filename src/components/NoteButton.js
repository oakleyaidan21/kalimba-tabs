import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { images } from "../constants/kalimbaConstants";

class NoteButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getImage = (time) => {
    for (let i = 0; i < images.length; i++) {
      if (time === images[i].time) {
        return images[i].image;
      }
    }
    return false;
  };

  render() {
    let noteImage = this.getImage(this.props.value);
    return (
      <Button
        variant="outline-primary"
        style={{
          margin: 5,
          backgroundColor:
            this.props.selectedNote === this.props.value ? "blue" : "white",
          color:
            this.props.selectedNote === this.props.value ? "white" : "blue",
        }}
        onClick={() => {
          this.props.changeNoteValue(this.props.value);
        }}
      >
        {noteImage === false ? (
          this.props.value
        ) : (
          <img
            src={noteImage}
            style={{ width: 15, height: "auto" }}
            alt={this.props.value}
          />
        )}
      </Button>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedNote: state.selectedNote,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeNoteValue: (value) =>
      dispatch({ type: "CHANGENOTEVALUE", value: value }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteButton);
