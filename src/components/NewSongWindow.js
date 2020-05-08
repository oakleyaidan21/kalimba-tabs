import React, { Component } from "react";
import { FaTimes } from "react-icons/fa";
import { connect } from "react-redux";
import KalimbaChooser from "./KalimbaChooser";
import { initialState } from "../constants/kalimbaConstants";

class NewSongWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      tempo: 0,
      notes: [...initialState.tineNotes],
    };
  }

  addNote = (note) => {
    if (!note.match(/^([CDEFGAB]#?)((?:-[1-2])|[0-8])$/)) {
      return;
    }
    let newNotes = [...this.state.notes];
    newNotes.push(note);
    this.setState({ notes: newNotes });
  };

  removeNote = (note) => {
    let newNotes = [...this.state.notes];
    let index = this.state.notes.indexOf(note);
    newNotes.splice(index, 1);
    this.setState({ notes: newNotes });
  };

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.modal}>
          <div style={styles.closeContainer}>
            <FaTimes
              onClick={() => {
                this.props.hide();
              }}
            />
          </div>
          <div
            style={{
              flex: 1,
              padding: 10,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ fontSize: 35, fontWeight: "bold" }}>New Song</div>
            <div style={styles.parameters}>
              <div style={styles.input}>
                <div style={{ width: 100 }}>Title</div>
                <input
                  style={{ flex: 1 }}
                  onChange={(e) => {
                    this.setState({ title: e.target.value });
                  }}
                ></input>
              </div>
              <div style={styles.input}>
                <div style={{ width: 100 }}>Tempo</div>
                <input
                  style={{ width: "20%" }}
                  onChange={(e) => {
                    this.setState({ tempo: e.target.value });
                  }}
                  type="number"
                  min="0"
                  max="500"
                ></input>
              </div>
              <div style={styles.kalimbaChooser}>
                <KalimbaChooser
                  notes={this.state.notes}
                  removeNote={(note) => {
                    this.removeNote(note);
                  }}
                  addNote={(note) => {
                    this.addNote(note);
                  }}
                />
              </div>
            </div>
          </div>
          <div style={styles.bottomButtons}>
            <div
              style={{ ...styles.button, backgroundColor: "#60a1fc" }}
              onClick={() => {
                if (
                  this.state.title.length === 0 ||
                  this.state.tempo === 0 ||
                  this.state.notes.length === 0
                ) {
                  return;
                }
                this.props.openNewSongFromParameters({ ...this.state });
                this.props.onCreate();
              }}
            >
              Create
            </div>
            <div
              style={{ ...styles.button, backgroundColor: "lightgrey" }}
              onClick={() => {
                this.props.hide();
              }}
            >
              Cancel
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    position: "absolute",
    backgroundColor: "rgba(200,200,200,0.5)",
    width: "100%",
    height: "100%",
    zIndex: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "70%",
    position: "relative",
    height: "85%",
    borderRadius: 5,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
  },
  closeContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    cursor: "pointer",
  },
  parameters: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  input: {
    marginTop: 10,
    width: "100%",
    height: 50,
    display: "flex",
    alignItems: "center",
  },
  kalimbaChooser: {
    flex: 1,
    display: "flex",
    backgroundColor: "lightgrey",
    borderRadius: 5,
  },
  bottomButtons: {
    width: "100%",
    height: 100,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  button: {
    width: 100,
    height: 50,
    borderRadius: 2,
    margin: 10,
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeTitle: (title) => dispatch({ type: "CHANGE_TITLE", title }),
    changeTempo: (tempo) => dispatch({ type: "CHANGE_TEMPO", tempo }),
    changeNotes: (notes) => dispatch({ type: "CHANGE_NOTES", notes }),
    openNewSongFromParameters: (data) =>
      dispatch({ type: "NEW_SONG_FROM_PARAMETERS", data }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewSongWindow);
