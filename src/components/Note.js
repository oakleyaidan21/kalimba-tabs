import React, { Component } from "react";
import { connect } from "react-redux";
import { images } from "../constants/kalimbaConstants";

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

  getImage = (time) => {
    for (let i = 0; i < images.length; i++) {
      if (time === images[i].time) {
        return images[i].image;
      }
    }
    return false;
  };

  render() {
    let wasClicked =
      this.props.song[this.props.tineIndex][this.props.noteIndex].note !== "";

    let displayTime = this.props.song[this.props.tineIndex][
      this.props.noteIndex
    ].time;

    let imgsrc = this.getImage(displayTime);
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
        {/* {wasClicked
          ? this.state.accidental !== "None"
            ? displayTime + this.state.accidental
            : displayTime
          : ""}
           */}
        {wasClicked ? (
          this.state.accidental !== "None" ? (
            <div>
              {noteImage}
              <div>{this.state.accidental}</div>
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
  };
};

export default connect(mapStateToProps)(Note);
