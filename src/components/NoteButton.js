import React, { Component } from "react";
import { connect } from "react-redux";
import ToolBarButton from "./ToolBarButton";
import { noteImages } from "../constants/kalimbaConstants";

class NoteButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getImage = (time) => {
    const found = noteImages.find((noteImage) => time === noteImage.time);
    return found ? found.image : false;
  };

  render() {
    let noteImage = this.getImage(this.props.value);
    return (
      <ToolBarButton
        onClick={() => {
          this.props.changeNoteValue(this.props.value);
        }}
        selected={this.props.value === this.props.selectedNote}
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
      </ToolBarButton>
      // return (
      //   <Button
      //     variant="outline-primary"
      //     style={{
      //       margin: 5,
      //       backgroundColor:
      //         this.props.selectedNote === this.props.value ? "blue" : "white",
      //       color:
      //         this.props.selectedNote === this.props.value ? "white" : "blue",
      //     }}
      //     onClick={() => {
      //       this.props.changeNoteValue(this.props.value);
      //     }}
      //   >
      //     {noteImage === false ? (
      //       this.props.value
      //     ) : (
      //       <img
      //         src={noteImage}
      //         style={{ width: 15, height: "auto" }}
      //         alt={this.props.value}
      //       />
      //     )}
      //   </Button>
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
      dispatch({ type: "CHANGE_NOTE_VALUE", value: value }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteButton);
