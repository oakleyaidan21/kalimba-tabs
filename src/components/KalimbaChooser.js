import React, { Component } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";

class KalimbaChooser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newNote: "",
    };
  }

  render() {
    return (
      <div style={styles.container}>
        {this.props.notes.map((note) => (
          <div style={{ ...styles.tine, flex: this.props.notes.length }}>
            <FaTimes
              style={{ cursor: "pointer" }}
              onClick={() => {
                this.props.removeNote(note);
              }}
            />
            {note}
          </div>
        ))}
        <input
          onChange={(e) => {
            this.setState({ newNote: e.target.value });
          }}
          value={this.state.newNote}
          style={{ width: 50 }}
        />
        <div
          onClick={() => {
            this.props.addNote(this.state.newNote);
          }}
        >
          <FaPlus style={{ cursor: "pointer" }} />
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
  },
  tine: {
    height: 125,
    borderRadius: 25,
    backgroundColor: "#60a1fc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    flexDirection: "column",
  },
};

export default KalimbaChooser;
