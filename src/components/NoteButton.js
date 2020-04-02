import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";

class NoteButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Button
        variant="outline-primary"
        style={{
          margin: 5,
          backgroundColor:
            this.props.selectedNote === this.props.value ? "blue" : "white",
          color: this.props.selectedNote === this.props.value ? "white" : "blue"
        }}
        onClick={() => {
          this.props.changeNoteValue(this.props.value);
        }}
      >
        {this.props.value}
      </Button>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedNote: state.selectedNote
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeNoteValue: value =>
      dispatch({ type: "CHANGENOTEVALUE", value: value })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteButton);
