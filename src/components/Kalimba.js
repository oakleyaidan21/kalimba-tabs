import React, { Component } from "react";
import Note from "./Note";
import { connect } from "react-redux";

const coloredTines = [2, 5, 8, 11, 14];
class Kalimba extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      kalimba: null
    };
  }

  componentDidMount = async () => {
    //scroll to bottom
    this.kalimbaStart.scrollIntoView({ behavior: "smooth" });
  };

  render() {
    return (
      <div
        style={{
          width: "100%",
          overflow: "auto",
          height: 51 * this.props.song[0].length
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
                  : "blue",
                flex: 17,
                height:
                  50 * this.props.song[0].length +
                  (8 - Math.abs(8 - tineIndex)) * 10,
                borderRadius: 20
              }}
              key={tine}
            >
              {/* NOTES */}
              {Array.from(Array(this.props.song[0].length).keys()).map(
                (note, noteIndex) => (
                  <Note
                    noteName={tine}
                    onClick={(wasClicked, time) => {
                      console.log(
                        "tine index:",
                        tineIndex,
                        "noteIndex:",
                        noteIndex
                      );
                      //add or remove redux song
                      this.props.clickedNote({
                        tineIndex,
                        noteIndex,
                        tine,
                        time,
                        wasClicked
                      });
                      //play note
                      if (!wasClicked) {
                        this.props.kalimba.play(tine, 500);
                      }
                    }}
                    isHighlighted={this.props.currentNote === noteIndex}
                  />
                )
              )}
            </div>
          ))}
        </div>
        {/* NOTE SELECTOR */}
        <div style={styles.noteSelectorContainer}>
          {this.props.tineNotes.map((tine, tineIndex) => (
            <div style={{ flex: 17, textAlign: "center" }}>{tine}</div>
          ))}
        </div>
        {/* DUMMY DIV TO SCROLL TO BOTTOM */}
        <div
          style={styles.dummyDiv}
          ref={ref => {
            this.kalimbaStart = ref;
          }}
        />
      </div>
    );
  }
}

const styles = {
  tineContainer: {
    display: "flex",
    height: "99.9%",
    width: "100%",
    flexDirection: "row",
    overflow: "hidden"
  },
  note: {
    height: 45,
    marginTop: 5
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
    borderTop: "2px solid grey"
  },
  dummyDiv: {
    float: "left",
    clear: "both",
    alignSelf: "flex-end"
  }
};

const mapStateToProps = state => {
  return {
    tineNotes: state.tineNotes,
    song: state.song
  };
};

const mapDispatchToProps = dispatch => {
  return {
    clickedNote: noteDetails =>
      dispatch({ type: "NOTECLICKED", noteDetails: noteDetails })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Kalimba);
