import React, { Component } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";

class KalimbaChooser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newNoteRight: "",
      newNoteLeft: "",
    };
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.tineContainer}>
          <div style={{ marginRight: 3 }}>
            <input
              onChange={(e) => {
                this.setState({ newNoteLeft: e.target.value });
              }}
              value={this.state.newNoteLeft}
              style={{ width: 40, height: 40 }}
            />
            <div
              onClick={() => {
                this.props.addNote(this.state.newNoteLeft, true);
              }}
            >
              <FaPlus style={{ cursor: "pointer" }} />
            </div>
          </div>
          {this.props.notes.map((note, index) => (
            <div
              style={{
                ...styles.tine,
                flex: this.props.notes.length,
                height:
                  150 +
                  Math.ceil(this.props.notes.length / 2) -
                  1 -
                  Math.abs(Math.ceil(this.props.notes.length / 2) - 1 - index) *
                    10,
              }}
            >
              <div style={{ flex: 1 }}>
                <FaTimes
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    this.props.removeNote(note);
                  }}
                  color="black"
                />
              </div>
              <div style={{ height: 10, marginBottom: 20 }}>{note}</div>
            </div>
          ))}
          <div style={{ marginLeft: 3 }}>
            <input
              onChange={(e) => {
                this.setState({ newNoteRight: e.target.value });
              }}
              value={this.state.newNoteRight}
              style={{ width: 40, height: 40 }}
            />
            <div
              onClick={() => {
                this.props.addNote(this.state.newNoteRight, false);
              }}
            >
              <FaPlus style={{ cursor: "pointer" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  tine: {
    maxWidth: 40,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: "#60a1fc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 3,
    marginLeft: 3,
    flexDirection: "column",
    fontWeight: "bold",
    color: "white",
  },
  tineContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
  },
};

export default KalimbaChooser;
