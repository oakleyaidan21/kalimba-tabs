import React, { Component } from "react";
import Kalimba from "../components/Kalimba";
import { connect } from "react-redux";
import { getInstruments } from "mobx-music";
import { delay } from "q";

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
      let shortestInterval = 500; //will default to half a second one lines without any notes
      for (let j = 0; j < 17; j++) {
        //get each valid note from the line
        if (this.props.song[j][i].note !== "") {
          notesToPlay.push(this.props.song[j][i]);
        }
      }
      //play all the valid notes
      for (let k = 0; k < notesToPlay.length; k++) {
        if (notesToPlay[k].time < shortestInterval) {
          shortestInterval = notesToPlay[k].time;
        }
        this.state.kalimba.play(notesToPlay[k].note);
      }
      this.setState({ currentNoteIndex: i });
      await delay(shortestInterval);
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
          {/* PLAY BUTTON */}
          <div
            onClick={() => {
              this.state.playing ? this.stopSong() : this.playSong();
            }}
          >
            {this.state.playing ? "Stop" : "Play"}
          </div>
          {/* Save */}
          <div onClick={() => {}}>Save</div>
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
    justifyContent: "center",
    alignItems: "center",
    left: -10,
    width: "110%",
    boxShadow: "0px 5px 5px grey",
    height: 70,
    backgroundColor: "white"
  }
};

const mapStateToProps = state => {
  return {
    test: state.test,
    tineNotes: state.tineNotes,
    song: state.song
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TabCreator);
