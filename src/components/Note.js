import React, { Component } from "react";
import { connect } from "react-redux";
import {
  noteImages,
  restImages,
  findAccidentals,
} from "../constants/kalimbaConstants";

class Note extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      hovered: false,
      time: 4,
      accidental: "None",
    };
  }

  getImage = (time, isRest) => {
    if (!isRest) {
      for (let i = 0; i < noteImages.length; i++) {
        if (time === noteImages[i].time) {
          return noteImages[i].image;
        }
      }
    } else {
      for (let i = 0; i < restImages.length; i++) {
        if (time === restImages[i].time) {
          return restImages[i].image;
        }
      }
    }

    return false;
  };

  checkForAccidental = () => {
    //if the note has any type of accidental, check it against the tine notes
    //if the tine notes and this not match, don't display an accidental
    //otherwise do.
    let noteInSong = this.props.song[this.props.tineIndex][this.props.noteIndex]
      .note;
    if (this.props.tineNotes[this.props.tineIndex] === noteInSong) {
      return false;
    } else {
      return findAccidentals(noteInSong);
    }
  };

  render() {
    let wasClicked =
      this.props.song[this.props.tineIndex][this.props.noteIndex].note !== "";

    let displayTime = this.props.song[this.props.tineIndex][
      this.props.noteIndex
    ].time;

    let imgsrc = this.getImage(
      displayTime,
      this.props.song[this.props.tineIndex][this.props.noteIndex].note ===
        "rest"
    );

    let acc = this.checkForAccidental();

    let noteImage = displayTime;
    if (imgsrc) {
      noteImage = (
        <img
          src={imgsrc}
          style={{ width: 15, height: "auto" }}
          alt={this.props.value}
        />
      );
    }

    if (
      this.props.song[this.props.tineIndex][this.props.noteIndex].note ===
      "rest"
    ) {
      displayTime += "R";
    }
    return (
      <div
        style={{
          height: 45,
          marginTop: 5,
          display: "flex",
          backgroundColor:
            this.state.hovered || this.props.isHighlighted ? "yellow" : "",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() => {
          this.setState({
            // selected: !this.state.selected,
            time: this.props.selectedNote,
            accidental: this.props.selectedAccidental,
          });
          this.props.onClick(
            wasClicked,
            this.props.selectedNote,
            this.props.rest
          );
        }}
        onMouseEnter={() => {
          this.setState({ hovered: true });
        }}
        onMouseLeave={() => {
          this.setState({ hovered: false });
        }}
      >
        {wasClicked ? (
          acc !== false ? (
            <div>
              {noteImage}
              <div>{acc}</div>
            </div>
          ) : (
            noteImage
          )
        ) : (
          ""
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedNote: state.selectedNote,
    selectedAccidental: state.selectedAccidental,
    song: state.song,
    rest: state.rest,
    tineNotes: state.tineNotes,
  };
};

export default connect(mapStateToProps)(Note);
