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
      const found = noteImages.find((noteImage) => time === noteImage.time);
      return found ? found.image : false;
    } else {
      const found = restImages.find((restImage) => time === restImage.time);
      return found ? found.image : false;
    }
  };

  checkForAccidental = () => {
    //if the note has any type of accidental, check it against the tine notes
    //if the tine notes and this not match, don't display an accidental
    //otherwise do.
    let noteInSong = this.props.song[this.props.noteIndex][this.props.tineIndex]
      .note;
    if (this.props.tineNotes[this.props.tineIndex] === noteInSong) {
      return false;
    } else {
      return findAccidentals(noteInSong);
    }
  };

  render() {
    let noteInQuestion = this.props.song[this.props.noteIndex][
      this.props.tineIndex
    ];
    let wasClicked = noteInQuestion.note !== "";
    let displayTime = noteInQuestion.time;
    let isRest = noteInQuestion.note === "rest";

    let acc = this.checkForAccidental();
    let noteImage = displayTime;
    let isTriplet = noteInQuestion.tripletMode;

    if (isTriplet === true) {
      displayTime = (displayTime * 2) / 3;
    }

    let imgsrc = this.getImage(displayTime, isRest);
    if (imgsrc) {
      noteImage = (
        <img
          src={imgsrc}
          style={{ width: 15, height: "auto" }}
          alt={this.props.value}
        />
      );
    }

    return (
      <div
        style={{
          height: 45,
          marginTop: 5,
          display: "flex",
          backgroundColor: this.props.isSelected
            ? "purple"
            : this.state.hovered
            ? "yellow"
            : "",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => {
          if (this.props.selectionMode) {
            this.props.onSelectedRow();
          } else {
            this.props.onClickedNote(wasClicked);
          }
        }}
        onMouseEnter={() => {
          this.setState({ hovered: true });
        }}
        onMouseLeave={() => {
          this.setState({ hovered: false });
        }}
        onContextMenu={() => {
          if (this.props.selectionMode) {
            this.props.pasteSelection();
          } else {
            this.props.onRightClick();
          }
        }}
      >
        {wasClicked ? (
          acc !== false ? (
            <div>
              {isTriplet ? <div>3</div> : <></>}
              {noteImage}
              {isRest ? <></> : <div>{acc}</div>}
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
    tineNotes: state.tineNotes,
    selectionMode: state.selectionMode,
  };
};

export default connect(mapStateToProps)(Note);
