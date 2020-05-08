import React, { Component } from "react";
import { FaTimes } from "react-icons/fa";

class NewSongWindow extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
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
                <input style={{ flex: 1 }}></input>
              </div>
              <div style={styles.input}>
                <div style={{ width: 100 }}>Tempo</div>
                <input style={{ width: "20%" }}></input>
              </div>
              <div style={styles.kalimbaChooser}></div>
            </div>
          </div>
          <div style={styles.bottomButtons}>
            <div
              style={{ ...styles.button, backgroundColor: "#60a1fc" }}
              onClick={() => {
                this.props.create();
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
    backgroundColor: "grey",
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

export default NewSongWindow;
