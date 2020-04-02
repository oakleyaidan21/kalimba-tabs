import React, { Component } from "react";
import { connect } from "react-redux";

class Note extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      hovered: false,
      time: 4,
      accidental: "None"
    };
  }
  render() {
    let wasClicked =
      this.props.song[this.props.tineIndex][this.props.noteIndex].note !== "";
    let displayTime = this.props.song[this.props.tineIndex][
      this.props.noteIndex
    ].time;
    return (
      <div
        style={{
          height: 45,
          marginTop: 5,
          display: "flex",
          backgroundColor:
            this.state.hovered || this.props.isHighlighted ? "yellow" : "",
          justifyContent: "center",
          alignItems: "center"
        }}
        onClick={() => {
          this.setState({
            // selected: !this.state.selected,
            time: this.props.selectedNote,
            accidental: this.props.selectedAccidental
          });
          this.props.onClick(wasClicked, this.props.selectedNote);
        }}
        onMouseEnter={() => {
          this.setState({ hovered: true });
        }}
        onMouseLeave={() => {
          this.setState({ hovered: false });
        }}
      >
        {wasClicked
          ? this.state.accidental !== "None"
            ? displayTime + this.state.accidental
            : displayTime
          : ""}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedNote: state.selectedNote,
    selectedAccidental: state.selectedAccidental,
    song: state.song
  };
};

export default connect(mapStateToProps)(Note);
