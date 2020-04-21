import React, { Component } from "react";
import Note from "./Note";
import { connect } from "react-redux";
import NoteChanger from "./NoteChanger";
import NoteToolBar from "./NoteToolBar";
import { findAccidentals } from "../constants/kalimbaConstants";

const coloredTines = [2, 5, 8, 11, 14];

class Kalimba extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      kalimba: null,
    };
  }

  componentDidMount = async () => {
    //scroll to bottom
    this.kalimbaStart.scrollIntoView({ behavior: "smooth" });
  };

  playNote = (wasClicked, tine) => {
    if (!wasClicked) {
      let noteToPlay = tine;
      if (this.props.selectedAccidental === "♯") {
        if (findAccidentals(noteToPlay) !== "♯") {
          if (noteToPlay.length === 3) {
            noteToPlay = noteToPlay[0] + "#" + noteToPlay[2];
          } else {
            noteToPlay = noteToPlay[0] + "#" + noteToPlay[1];
          }
        }
      }
      if (this.props.selectedAccidental === "♭") {
        if (findAccidentals(noteToPlay) !== "♭") {
          if (noteToPlay.length === 3) {
            noteToPlay = noteToPlay[0] + "b" + noteToPlay[2];
          } else {
            noteToPlay = noteToPlay[0] + "b" + noteToPlay[1];
          }
        }
      }
      if (this.props.selectedAccidental === "♮") {
        noteToPlay = noteToPlay.replace("#", "").replace("b", "");
      }
      if (!this.props.rest) this.props.kalimba.play(noteToPlay, 500);
    }
  };

  render() {
    return (
      <div
        id="kalimba"
        style={{
          width: "100%",
          height: 50 * this.props.song.length + this.props.visibleHeight / 2,
        }}
      >
        {/* TINES */}
        <div style={styles.tineContainer}>
          {this.props.tineNotes.map((tine, tineIndex) => (
            <div
              style={{
                margin: 4,
                backgroundColor: !coloredTines.includes(tineIndex)
                  ? "lightgrey"
                  : "#60a1fc",
                flex: 17,
                height:
                  50 * this.props.song.length +
                  (8 - Math.abs(8 - tineIndex)) * 10,
                // borderRadiusBottomLeft: 20,
                // borderRadiusBottomRight: 20,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
              }}
              key={tine}
            >
              {/* NOTES */}
              {Array.from(Array(this.props.song.length).keys()).map(
                (note, noteIndex) => (
                  <Note
                    key={tine + noteIndex.toString()}
                    noteName={tine}
                    onRightClick={() => {
                      if (tineIndex > 8) {
                        this.props.addRow(noteIndex);
                      } else {
                        this.props.removeRow(noteIndex);
                      }
                    }}
                    toggleNoteBar={() => {
                      this.props.toggleNoteBar(noteIndex, tineIndex);
                    }}
                    pasteSelection={() => {
                      this.props.pasteSelection(noteIndex);
                    }}
                    isSelected={
                      this.props.selectedRows.find(
                        (row) => row.noteIndex === noteIndex
                      ) !== undefined
                    }
                    onSelectedRow={() => {
                      this.props.selectRow(noteIndex);
                    }}
                    onClickedNote={(wasClicked) => {
                      //add or remove from redux song
                      this.props.clickedNote({
                        tineIndex,
                        noteIndex,
                        tine,
                      });
                      //play note
                      this.playNote(wasClicked, tine);
                    }}
                    noteIndex={noteIndex}
                    tineIndex={tineIndex}
                  />
                )
              )}
            </div>
          ))}
        </div>
        {/* NOTE SPECIFIC TASK BAR */}
        {this.props.showNoteBar && <NoteToolBar />}
        {/* NOTE SELECTOR */}
        <div style={styles.noteSelectorContainer}>
          {this.props.tineNotes.map((tine) => (
            <NoteChanger tine={tine} />
          ))}
        </div>
        {/* DUMMY DIV TO SCROLL TO BOTTOM */}
        <div
          style={styles.dummyDiv}
          ref={(ref) => {
            this.kalimbaStart = ref;
          }}
        />
        {/* PLAYING BAR */}
        {this.props.playing && (
          <div
            style={{
              position: "absolute",
              height: 50,
              width: "50%",
              backgroundColor: "rgba(255,255,0,0.2)",
              top: this.props.visibleHeight / 2 - 50,
            }}
          />
        )}
      </div>
    );
  }
}

const styles = {
  tineContainer: {
    display: "flex",
    height: "100%",
    width: "100%",
    flexDirection: "row",
    overflow: "hidden",
  },
  note: {
    height: 45,
    marginTop: 5,
  },
  noteSelectorContainer: {
    position: "absolute",
    bottom: 0,
    width: "50%",
    display: "flex",
    flexDirection: "row",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderTop: "2px solid grey",
  },
  dummyDiv: {
    float: "left",
    clear: "both",
    alignSelf: "flex-end",
  },
};

const mapStateToProps = (state) => {
  return {
    tineNotes: state.tineNotes,
    song: state.song,
    selectedAccidental: state.selectedAccidental,
    rest: state.rest,
    tripletMode: state.tripletMode,
    selectedNote: state.selectedNote,
    selectedRows: state.selectedRows,
    showNoteBar: state.showNoteBar,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clickedNote: (noteDetails) =>
      dispatch({ type: "NOTE_CLICKED", noteDetails }),
    addRow: (noteIndex) => dispatch({ type: "ADD_ROW", noteIndex }),
    removeRow: (noteIndex) => dispatch({ type: "REMOVE_ROW", noteIndex }),
    extendSong: () => dispatch({ type: "EXTEND_SONG" }),
    selectRow: (noteIndex) => dispatch({ type: "SELECT_ROW", noteIndex }),
    pasteSelection: (noteIndex) =>
      dispatch({ type: "PASTE_SELECTION", noteIndex }),
    toggleNoteBar: (noteIndex, tineIndex) =>
      dispatch({ type: "SHOW_NOTE_BAR", noteIndex, tineIndex }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Kalimba);
