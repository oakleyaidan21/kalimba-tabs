import React, { Component } from "react";
import Kalimba from "../components/Kalimba";
import { connect } from "react-redux";
import { getInstruments } from "mobx-music";
import { delay } from "q";
import NoteButton from "../components/NoteButton";
import AccidentalButton from "../components/AccidentalButton";
import ToolBarButton from "../components/ToolBarButton";
import {
  FaPlay,
  FaStop,
  FaSave,
  FaFolderOpen,
  FaFileExport,
  FaHome,
  FaHandPointer,
  FaPlus,
} from "react-icons/fa";

import * as html2canvas from "html2canvas";
import * as jsPDF from "jspdf";
import ClipLoader from "react-spinners/ClipLoader";
import QuarterRest from "../kalimbaImages/restImages/quarter_rest.png";

var app = window.require("electron").remote;
const fs = app.require("fs");

class TabCreator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentNoteIndex: -1,
      kalimba: null,
      playing: false,
      isStopped: false,
      editTitle: false,
      editTempo: false,
      exporting: false,
      height: window.innerHeight,
      enteredTempo: 0,
    };
  }

  /**
   * Saves the song in the form of its redux array to the file system
   * @return {void} returns early if the user cancels
   */
  saveSong = async () => {
    //create kalimba folder if it doesn't exist
    let docpath = app.app.getPath("documents") + "/KalimbaTabs";
    if (!fs.existsSync(docpath)) {
      fs.mkdir(docpath, (err) => {
        if (err) alert(err);
      });
    }
    let contentToSave = {
      songTitle: this.props.songTitle,
      tempo: this.props.tempo,
      tineNotes: this.props.tineNotes,
      song: this.props.song,
    };
    //if the file already exists save it with no dialog
    if (fs.existsSync(docpath + "/" + this.props.songTitle + ".kal")) {
      fs.writeFile(
        docpath + "/" + this.props.songTitle + ".kal",
        JSON.stringify(contentToSave),
        (err) => {
          if (err) {
            alert("An error occurred while saving " + err.message);
          } else {
            alert("Successfully saved '" + this.props.songTitle + "'");
          }
        }
      );
      return;
    }
    let options = {
      title: this.props.songTitle,
      defaultPath: docpath + "/" + this.props.songTitle + ".kal",
    };
    app.dialog.showSaveDialog(options).then((file) => {
      if (file.canceled) {
        return;
      }
      fs.writeFile(file.filePath, JSON.stringify(contentToSave), (err) => {
        if (err) {
          alert("An error occurred while saving " + err.message);
        } else {
          alert("Successfully saved '" + this.props.songTitle + "'");
        }
      });
    });
  };

  /**
   * Opens a .kal file from the user's KalimbaTabs folder
   * @return {void} returns early if an error occurs opening the song
   */
  openSong = () => {
    //stop song if it's playing
    this.stopSong();
    //create kalimba folder if it doesn't exist
    let docpath = app.app.getPath("documents") + "/KalimbaTabs";
    if (!fs.existsSync(docpath)) {
      fs.mkdir(docpath, (err) => {
        if (err) alert(err);
      });
    }
    let options = {
      defaultPath: app.app.getPath("documents") + "/KalimbaTabs",
    };
    app.dialog.showOpenDialog(options).then((files) => {
      fs.readFile(files.filePaths[0], "utf-8", (err, data) => {
        if (err) {
          alert("An error occurred reading the file(s)" + err.message);
          return;
        }
        this.setState({
          editTitle: false,
          editTempo: false,
          isStopped: false,
          currentNoteIndex: -1,
        });

        this.props.openSong(JSON.parse(data));
        let kalimbaElement = document.getElementById("kalimbaContainer");
        kalimbaElement.scrollTop = kalimbaElement.scrollHeight;
      });
    });
  };

  /**
   * Stops the song playback
   */
  stopSong = () => {
    this.setState({
      isStopped: true,
      playing: false,
      currentNoteIndex: -1,
    });
  };

  /**
   * Plays the song by going through the redux song array
   * and collecting the locations with notes
   */
  playSong = async (fromStart) => {
    this.setState({ playing: true, isStopped: false });
    let kalimbaElement = document.getElementById("kalimbaContainer");
    kalimbaElement.scrollTop = kalimbaElement.scrollHeight;
    let optimizedSong = [];
    console.log(kalimbaElement.offsetHeight);
    //start the note search depending on user input
    //if they right clicked, play from the last clicked note
    //otherwise, play from the beginning
    let start =
      this.props.lastNoteIndex === 0
        ? this.props.song.length - 1
        : !fromStart
        ? this.props.song.length - 1
        : this.props.lastNoteIndex;

    //go through the song array and pick out only the notes that need to be played
    for (let i = start; i >= 0; i--) {
      let notesToPlay = { notes: [], time: 4 };
      let shortestInterval = -1;
      let fastestTempo = -1;
      for (let j = 0; j < 17; j++) {
        let noteToAdd = "";
        if (this.props.song[i][j].tempo !== undefined) {
          if (this.props.song[i][j].tempo > fastestTempo) {
            notesToPlay.tempo = this.props.song[i][j].tempo;
          }
        }
        if (this.props.song[i][j].note !== "") {
          noteToAdd = this.props.song[i][j].note;
        } else {
          continue;
        }
        if (shortestInterval < this.props.song[i][j].time) {
          shortestInterval = this.props.song[i][j].time;
        }
        notesToPlay.notes.push(noteToAdd);
        notesToPlay.time = shortestInterval;
      }
      optimizedSong.push(notesToPlay);
    }

    //go through optimizedSong, playing each note at the index
    //waits each iteration for as long as the shortest note at the index
    let currentTempo = this.props.tempo;
    for (let i = 0; i < optimizedSong.length; i++) {
      if (
        optimizedSong[i].tempo !== -1 &&
        optimizedSong[i].tempo !== undefined
      ) {
        console.log("changed here to ", optimizedSong[i].tempo);
        currentTempo = optimizedSong[i].tempo;
      }
      //set delay constant here so that users can change the tempo mid playback
      let delayConstant = 4 * (1000 / (currentTempo / 60));
      if (this.state.isStopped) {
        this.setState({
          currentNoteIndex: -1,
          isStopped: false,
          playing: false,
        });
        break;
      }
      //scroll the kalimba to the currently playing note
      kalimbaElement.scrollTop =
        kalimbaElement.scrollHeight -
        50 * (i + (this.props.song.length - start)) -
        window.innerHeight +
        50;

      //play each note in optimizedSong[i]
      for (let j = 0; j < optimizedSong[i].notes.length; j++) {
        if (optimizedSong[i].notes[j] !== "rest") {
          this.state.kalimba.play(optimizedSong[i].notes[j]);
        }
      }
      await delay(delayConstant / optimizedSong[i].time);
    }

    this.setState({ isStopped: false });
  };

  /**
   * Converts the kalimbaContainer element into a pdf.
   * Needs to scroll up every time it takes a snapshot of
   * the element.
   */
  exportToPDF = async () => {
    this.setState({ exporting: true });
    let input = document.getElementById("kalimbaContainer");
    //scroll to the bottom
    input.scrollTop = input.scrollHeight;
    let totalHeight = input.scrollHeight;
    let totalWidth = input.offsetWidth;
    let margin = 15;
    let pdfWidth = totalWidth + margin * 2;
    let pdfHeight = input.offsetHeight + margin * 2;
    let totalPages = Math.ceil(totalHeight / pdfHeight) - 1;
    let pdf = new jsPDF();
    for (let i = 0; i < totalPages; i++) {
      html2canvas(input).then(async (canvas) => {
        let imgData = canvas.toDataURL("image/jpeg", 1.0);
        pdf.addPage(pdfWidth, pdfHeight);
        pdf.addImage(imgData, "PNG", margin, margin, 0, 0);
      });
      //scroll up a page worth
      input.scrollTop -= input.offsetHeight - 50;
      await delay(1);
    }

    pdf.save(this.props.songTitle + ".pdf");
    this.setState({ exporting: false });
  };

  /**
   * Updates dimensions of kalimba to that of the window's height
   */
  updateDimensions() {
    this.setState({ height: window.innerHeight });
  }

  componentDidMount = async () => {
    //set up kalimba
    const { instruments } = await getInstruments(["kalimba"]);
    this.setState({ kalimba: instruments.get("kalimba") });
    //set window resize event listener
    this.updateDimensions();
    window.addEventListener("resize", () => {
      this.updateDimensions();
    });
  };

  componentWillUnmount = () => {
    window.removeEventListener("resize", () => {
      this.updateDimensions();
    });
  };

  render() {
    return (
      <div style={styles.tabCreatorContainer}>
        <div style={{ flex: 1 }}></div>
        {/* KALIMBA */}
        <div
          style={{
            flex: 2,
            display: "flex",
            height: this.state.height,
            overflow: "auto",
            justifyContent: "center",
          }}
          id="kalimbaContainer"
        >
          {/* wait for kalimba to load */}
          {this.state.kalimba !== null && (
            <Kalimba
              kalimba={this.state.kalimba}
              currentNote={this.state.currentNoteIndex}
              playing={this.state.playing}
              visibleHeight={this.state.height}
            />
          )}
        </div>
        <div style={{ flex: 1 }}></div>
        <div style={styles.controlPanelContainer}>
          {/* SONG CONTROL */}
          <div style={styles.songControlContainer}>
            {/* HOME BUTTON */}
            <ToolBarButton
              onClick={async () => {
                this.stopSong();
                await delay(1);
                this.props.history.push("/");
              }}
            >
              <FaHome size={30} />
            </ToolBarButton>

            {/* SAVE */}
            <ToolBarButton
              onClick={() => {
                this.saveSong();
              }}
            >
              <FaSave size={30} />
            </ToolBarButton>
            {/* OPEN */}
            <ToolBarButton
              onClick={() => {
                this.openSong();
              }}
            >
              <FaFolderOpen size={30} />
            </ToolBarButton>
            {/* EXPORT */}
            <ToolBarButton
              onClick={() => {
                this.exportToPDF();
              }}
              disabled={this.state.exporting || this.state.playing}
              selected={this.state.exporting}
            >
              {this.state.exporting ? (
                <ClipLoader size={30} color="blue" />
              ) : (
                <FaFileExport size={30} />
              )}
            </ToolBarButton>
            {/* PLAY BUTTON */}
            <ToolBarButton
              selected={this.state.playing}
              onClick={() => {
                this.state.playing ? this.stopSong() : this.playSong(false);
              }}
              onContextMenu={() => {
                this.state.playing ? this.stopSong() : this.playSong(true);
              }}
            >
              {this.state.playing ? (
                <FaStop color="red" size={30} />
              ) : (
                <FaPlay color="blue" size={30} />
              )}
            </ToolBarButton>
          </div>
          {/* TITLE INPUT */}
          <div style={styles.titleContainer}>
            {!this.state.editTitle ? (
              <div
                onClick={() => {
                  this.setState({ editTitle: true });
                }}
                style={styles.songTitle}
              >
                {this.props.songTitle}
              </div>
            ) : (
              <input
                placeholder={this.props.songTitle}
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    this.setState({ editTitle: false });
                  }
                }}
                style={styles.titleInput}
                onChange={(e) => {
                  this.props.changeTitle(e.target.value);
                }}
              />
            )}
            {!this.state.editTempo ? (
              <div
                onClick={() => {
                  this.setState({ editTempo: true });
                }}
                style={{ margin: 5 }}
              >
                {this.props.tempo}
              </div>
            ) : (
              <input
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    this.setState({ editTempo: false });
                    this.props.changeTempo(this.state.enteredTempo);
                  }
                }}
                placeholder={this.props.tempo}
                style={styles.tempoInput}
                type="number"
                min="0"
                onChange={(e) => {
                  // this.props.changeTempo(e.target.value);
                  this.setState({ enteredTempo: e.target.value });
                }}
              />
            )}
          </div>
          {/* NOTE TOOLBAR */}
          <div style={styles.noteToolbarContainer}>
            {/* SELECTION MODE BUTTON */}
            <ToolBarButton
              selected={this.props.selectionMode}
              onClick={() => {
                this.props.toggleSelectionMode();
              }}
            >
              <FaHandPointer />
            </ToolBarButton>
            <div style={styles.noteToolbarDivider} />
            {/* EXTEND SONG BUTTON */}
            <ToolBarButton
              onClick={() => {
                this.props.extendSong();
              }}
            >
              <FaPlus />
            </ToolBarButton>
            <div style={styles.noteToolbarDivider} />
            <NoteButton value={1} />
            <NoteButton value={2} />
            <NoteButton value={4} />
            <NoteButton value={8} />
            <NoteButton value={16} />
            <div style={styles.noteToolbarDivider} />
            <AccidentalButton value="♯" />
            <AccidentalButton value="♭" />
            <AccidentalButton value="♮" />
            <div style={styles.noteToolbarDivider} />
            {/* DOTTED BUTTON */}
            <ToolBarButton
              selected={this.props.dotted}
              onClick={() => {
                this.props.toggleDotted();
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: this.props.dotted ? "blue" : "black",
                }}
              />
            </ToolBarButton>
            {/* REST BUTTON */}
            <ToolBarButton
              selected={this.props.rest}
              onClick={() => {
                this.props.toggleRest();
              }}
            >
              <img
                src={QuarterRest}
                style={{ width: 15, height: "auto" }}
                alt={"resticon"}
              />
            </ToolBarButton>
            {/* TRIPLET BUTTON */}
            <ToolBarButton
              selected={this.props.tripletMode}
              onClick={() => {
                this.props.toggleTriplet();
              }}
            >
              -3-
            </ToolBarButton>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * Redux functions
 */
const mapStateToProps = (state) => {
  return {
    tineNotes: state.tineNotes,
    song: state.song,
    tempo: state.tempo,
    songTitle: state.songTitle,
    dotted: state.dotted,
    rest: state.rest,
    tripletMode: state.tripletMode,
    lastNoteIndex: state.lastNoteIndex,
    selectionMode: state.selectionMode,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleDotted: () => dispatch({ type: "TOGGLE_DOTTED" }),
    openSong: (data) => dispatch({ type: "OPEN_SONG", data: data }),
    changeTitle: (title) => dispatch({ type: "CHANGE_TITLE", title: title }),
    toggleRest: () => dispatch({ type: "TOGGLE_REST" }),
    changeTempo: (tempo) => dispatch({ type: "CHANGE_TEMPO", tempo: tempo }),
    toggleTriplet: () => dispatch({ type: "TOGGLE_TRIPLET" }),
    extendSong: () => dispatch({ type: "EXTEND_SONG" }),
    toggleSelectionMode: () => dispatch({ type: "TOGGLE_SELECTION_MODE" }),
  };
};

/**
 * Styling
 */
const divCenteredContent = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
};

const styles = {
  tabCreatorContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "row",
  },

  controlPanelContainer: {
    position: "absolute",
    top: 0,
    ...divCenteredContent,
    left: "-5%",
    width: "110%",
    boxShadow: "0px 5px 5px grey",
    height: 60,
    backgroundColor: "rgb(245,245,245)",
  },
  noteToolbarContainer: {
    flex: 3,
    ...divCenteredContent,
  },
  noteToolbarDivider: {
    height: 50,
    width: 2,
    backgroundColor: "lightgrey",
    margin: 5,
  },
  songControlContainer: {
    flex: 3,
    ...divCenteredContent,
  },
  songTitle: {
    margin: 5,
    fontSize: 30,
    fontWeight: "bold",
  },
  titleContainer: {
    flex: 1,
    ...divCenteredContent,
  },
  titleInput: {
    textAlign: "center",
    borderRadius: 3,
    border: "3px solid lightgrey",
  },
  tempoInput: {
    textAlign: "center",
    borderRadius: 3,
    border: "3px solid lightgrey",
    width: 50,
    margin: 5,
  },
  exportingModal: {
    ...divCenteredContent,
    width: "50%",
    alignSelf: "center",
    height: "100%",
    backgroundColor: "white",
    position: "absolute",
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(TabCreator);
