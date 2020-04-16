import React, { Component } from "react";
import { connect } from "react-redux";
import { FaMinus, FaPlus, FaPaste, FaTimes, FaStopwatch } from "react-icons/fa";

class NoteToolBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div style={styles.mainContainer}>
        <div style={styles.actionContainer}>
          <FaPlus
            onClick={() => {
              this.props.addRow(this.props.noteBarNoteIndex);
            }}
          />
        </div>
        <div style={styles.actionContainer}>
          <FaMinus
            onClick={() => {
              this.props.removeRow(this.props.noteBarNoteIndex);
            }}
          />
        </div>
        <div style={styles.actionContainer}>
          <FaPaste
            onClick={() => {
              this.props.pasteSelection(this.props.noteBarNoteIndex);
              this.props.hideNoteBar();
            }}
          />
        </div>
        <div style={styles.actionContainer}>
          <FaStopwatch
            onClick={() => {
              this.props.noteTempoChange();
              this.props.hideNoteBar();
            }}
          />
        </div>
        <div style={styles.actionContainer}>
          <FaTimes
            onClick={() => {
              this.props.hideNoteBar();
            }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    noteBarNoteIndex: state.noteBarNoteIndex,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    hideNoteBar: () => dispatch({ type: "HIDE_NOTE_BAR" }),
    addRow: (noteIndex) => dispatch({ type: "ADD_ROW", noteIndex }),
    removeRow: (noteIndex) => dispatch({ type: "REMOVE_ROW", noteIndex }),
    pasteSelection: (noteIndex) =>
      dispatch({ type: "PASTE_SELECTION", noteIndex }),
    noteTempoChange: (noteIndex, tineIndex) =>
      dispatch({ type: "NOTE_TEMPO_CHANGE", noteIndex, tineIndex }),
  };
};

const styles = {
  mainContainer: {
    position: "absolute",
    display: "flex",
    height: 40,
    top: 75,
    width: 300,
    marginLeft: 50,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    boxShadow: "2px 2px 2px",
  },
  actionContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    cursor: "pointer",
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(NoteToolBar);
