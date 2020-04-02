import React, { Component } from "react";
import Kalimba from "../components/Kalimba";
import { connect } from "react-redux";
import { getInstruments } from "mobx-music";
import { delay } from "q";
import NoteButton from "../components/NoteButton";
import AccidentalButton from "../components/AccidentalButton";
import { FaPlay, FaStop, FaSave, FaFolderOpen } from "react-icons/fa";
import { Button } from "react-bootstrap";

// const { dialog, app } = window.require("electron").remote;
// var fs = app.require("fs");
var app = window.require("electron").remote;
const fs = app.require("fs");

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

  saveSong = async () => {
    app.dialog.showSaveDialog().then(file => {
      if (file.cancelled) {
        return;
      }
      console.log(file);
      fs.writeFile(file.filePath, JSON.stringify(this.props.song), err => {
        if (err) {
          alert("An error occurred while saving" + err.message);
        } else {
          alert("Successfully saved '" + this.props.songTitle + "'");
        }
      });
    });
  };

  openSong = () => {
    app.dialog.showOpenDialog().then(files => {
      fs.readFile(files.filePaths[0], "utf-8", (err, data) => {
        if (err) {
          alert("An error occurred reading the file(s)" + err.message);
          return;
        }
        // console.log("The file content is:", JSON.parse(data));
        this.props.openSong(JSON.parse(data));
      });
    });
  };

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
    let kalimbaElement = document.getElementById("kalimbaContainer");
    kalimbaElement.scrollTop = kalimbaElement.scrollHeight;

    //go through each tine and play each note, then go up the notes
    for (let i = this.props.song[0].length - 1; i >= 0; i--) {
      if (this.state.isStopped) break;

      //scroll to current note
      kalimbaElement.scrollTop =
        kalimbaElement.scrollHeight -
        50 * (this.props.song[0].length - i) -
        (window.innerHeight - 100);
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
        <div style={styles.kalimbaContainer} id="kalimbaContainer">
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
                this.saveSong();
              }}
            >
              <FaSave size={30} />
            </div>
            <div
              style={{ margin: 10 }}
              onClick={() => {
                this.openSong();
              }}
            >
              <FaFolderOpen size={30} />
            </div>
          </div>
          {/* TITLE INPUT */}
          <div style={styles.titleContainer}>
            <input
              placeholder={"Untitled"}
              style={styles.titleInput}
              onChange={e => {
                this.props.changeTitle(e.target.value);
              }}
            />
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
    toggleDotted: () => dispatch({ type: "TOGGLEDOTTED" }),
    openSong: data => dispatch({ type: "OPENSONG", data: data }),
    changeTitle: title => dispatch({ type: "CHANGETITLE", title: title })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TabCreator);
