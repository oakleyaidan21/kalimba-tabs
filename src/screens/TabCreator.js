import React, { Component } from "react";
import Kalimba from "../components/Kalimba";
import { connect } from "react-redux";
import { getInstruments } from "mobx-music";
import { delay } from "q";
import NoteButton from "../components/NoteButton";
import AccidentalButton from "../components/AccidentalButton";
import { FaPlay, FaStop, FaSave } from "react-icons/fa";
import { Button } from "react-bootstrap";

const { dialog, app } = window.require("electron").remote;

class TabCreator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentNoteIndex: -1,
      kalimba: null,
      playing: false,
      isStopped: false
    };
  }

  componentDidMount = async () => {
    //set up kalimba
    const { instruments } = await getInstruments(["kalimba"]);
    this.setState({ kalimba: instruments.get("kalimba") });
  };

  stopSong = () => {
    this.setState({ isStopped: true, playing: false, currentNoteIndex: -1 });
  };

  playSong = async () => {
    this.setState({ playing: true });
    //go through each tine and play each note, then go up the notes

    for (let i = this.props.song[0].length - 1; i >= 0; i--) {
      if (this.state.isStopped) break;
      let notesToPlay = [];
      let shortestInterval = 4; //will default quarter note
      for (let j = 0; j < 17; j++) {
        //get each valid note from the line
        if (this.props.song[j][i].note !== "") {
          notesToPlay.push(this.props.song[j][i]);
        }
      }
      //play all the valid notes
      for (let k = 0; k < notesToPlay.length; k++) {
        if (notesToPlay[k].time > shortestInterval) {
          shortestInterval = notesToPlay[k].time;
        }
        this.state.kalimba.play(notesToPlay[k].note);
      }
      this.setState({ currentNoteIndex: i });
      //convert note time into milliseconds with the current tempo
      let delayTime = (4 * (1000 / (this.props.tempo / 60))) / shortestInterval;
      await delay(delayTime);
    }

    this.setState({ isStopped: false });
  };

  render() {
    return (
      <div style={styles.tabCreatorContainer}>
        <div style={{ flex: 1 }}></div>
        {/* KALIMBA */}
        <div style={styles.kalimbaContainer}>
          {/* wait for kalimba to load */}
          {this.state.kalimba !== null && (
            <Kalimba
              kalimba={this.state.kalimba}
              currentNote={this.state.currentNoteIndex}
            />
          )}
        </div>
        <div style={{ flex: 1 }}></div>
        <div style={styles.controlPanelContainer}>
          {/* SONG CONTROL */}
          <div style={styles.songControlContainer}>
            {/* PLAY BUTTON */}
            <div
              onClick={() => {
                this.state.playing ? this.stopSong() : this.playSong();
              }}
              style={{ margin: 10 }}
            >
              {this.state.playing ? (
                <FaStop color="red" size={30} />
              ) : (
                <FaPlay color="blue" size={30} />
              )}
            </div>
            {/* Save */}
            <div
              style={{ margin: 10 }}
              onClick={() => {
                // temp save function to demonstrate electron functions
                console.log(
                  dialog.showOpenDialog({
                    defaultPath: app.getPath("documents") + "/KalimbaTabs",
                    properties: [
                      "openFile",
                      "multiSelectrons",
                      "promptToCreate"
                    ]
                  })
                );
              }}
            >
              <FaSave size={30} />
            </div>
          </div>
          {/* TITLE INPUT */}
          <div style={styles.titleContainer}>
            <input
              placeholder={this.props.songTitle}
              style={styles.titleInput}
            ></input>
          </div>
          {/* NOTE TOOLBAR */}
          <div style={styles.noteToolbarContainer}>
            <NoteButton value={4} />
            <NoteButton value={8} />
            <NoteButton value={16} />
            <div style={styles.noteToolbarDivider} />
            <AccidentalButton value="♯" />
            <AccidentalButton value="♭" />
            <AccidentalButton value="♮" />
            <AccidentalButton value="None" />
            <div style={styles.noteToolbarDivider} />
            <Button
              variant="outline-primary"
              style={{
                margin: 5,
                backgroundColor: this.props.dotted ? "blue" : "white"
              }}
              onClick={() => {
                this.props.toggleDotted();
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: this.props.dotted ? "white" : "blue"
                }}
              ></div>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const divCenteredContent = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row"
};

const styles = {
  tabCreatorContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "row"
  },
  kalimbaContainer: {
    flex: 2,
    display: "flex",
    height: window.innerHeight,
    overflow: "auto",
    justifyContent: "center"
  },
  controlPanelContainer: {
    position: "absolute",
    top: 0,
    ...divCenteredContent,
    left: "-5%",
    width: "110%",
    boxShadow: "0px 5px 5px grey",
    height: 60,
    backgroundColor: "white"
  },
  noteToolbarContainer: {
    flex: 1,
    ...divCenteredContent
  },
  noteToolbarDivider: {
    height: 50,
    width: 2,
    backgroundColor: "lightgrey",
    margin: 5
  },
  songControlContainer: {
    flex: 1,
    ...divCenteredContent
  },
  titleContainer: {
    flex: 1,
    ...divCenteredContent
  },
  titleInput: {
    textAlign: "center",
    borderRadius: 3,
    border: "3px solid lightgrey"
  }
};

const mapStateToProps = state => {
  return {
    test: state.test,
    tineNotes: state.tineNotes,
    song: state.song,
    tempo: state.tempo,
    songTitle: state.songTitle,
    dotted: state.dotted
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleDotted: () => dispatch({ type: "TOGGLEDOTTED" })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TabCreator);
