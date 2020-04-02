import React, { Component } from "react";
import Kalimba from "../components/Kalimba";
import { connect } from "react-redux";
import { getInstruments } from "mobx-music";
import { delay } from "q";
import NoteButton from "../components/NoteButton";
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
          {/* NOTE TOOLBAR */}
          <div style={styles.noteToolbarContainer}>
            <NoteButton value={4} />
            <NoteButton value={8} />
            <NoteButton value={16} />
            <div
              style={{ height: 50, width: 2, backgroundColor: "lightgrey" }}
            />
            <Button variant="outline-primary" style={{ margin: 5 }}>
              #
            </Button>
            <Button variant="outline-primary" style={{ margin: 5 }}>
              ♭
            </Button>
          </div>
          {/* TITLE INPUT */}
          <div style={{ flex: 1 }}></div>
          {/* SONG CONTROL */}
          <div style={styles.songControlContainer}>
            {/* PLAY BUTTON */}
            <div
              onClick={() => {
                this.state.playing ? this.stopSong() : this.playSong();
              }}
              style={{ margin: 10 }}
            >
              {this.state.playing ? <FaStop /> : <FaPlay />}
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
              <FaSave />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

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
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    left: "-5%",
    width: "110%",
    boxShadow: "0px 5px 5px grey",
    height: 60,
    backgroundColor: "white"
  },
  noteToolbarContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  songControlContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
};

const mapStateToProps = state => {
  return {
    test: state.test,
    tineNotes: state.tineNotes,
    song: state.song,
    tempo: state.tempo
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TabCreator);
