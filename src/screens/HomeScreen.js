import React, { Component } from "react";
import { Link } from "react-router-dom";
import SongItem from "../components/SongItem";
import { connect } from "react-redux";
import { FaPlus } from "react-icons/fa";

var app = window.require("electron").remote;
const fs = app.require("fs");

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pressed: false,
      songs: [],
    };
  }

  /**
   * Reads a file from the KalimbaTabs folder based on its title
   * Then navigates to
   * @param {string} title The title of the desired song to open
   */
  openSong = (title) => {
    //read from file system
    let docpath = app.app.getPath("documents") + "/KalimbaTabs/" + title;
    fs.readFile(docpath, "utf-8", (err, data) => {
      if (err) {
        alert("an error occurred reading the files" + err.message);
        return;
      }
      this.props.openSong(JSON.parse(data));
    });
    //navigate
    this.props.history.push("/tabcreator");
  };

  componentDidMount = () => {
    // set up tabs folder
    let docpath = app.app.getPath("documents") + "/KalimbaTabs";
    if (!fs.existsSync(docpath)) {
      fs.mkdir(docpath, (err) => {
        if (err) alert(err);
      });
    }
    // get songs from folder
    fs.readdir(docpath, (err, files) => {
      console.log(files);
      if (err) {
        alert(err);
        return;
      }
      this.setState({ songs: files });
    });
  };

  /**
   * Clears the redux song and then navigates to empty TabCreator
   */
  newSongClicked = () => {
    //should probably have some type of creation modal appear first
    //where they input a title, tempo, etc
    this.props.openNewSong();
    this.props.history.push("/tabcreator");
  };

  render() {
    console.log(this.props);
    return (
      <div style={styles.homeContainer}>
        {/* HEADER */}
        <div style={styles.header}>Kalimba Tabs</div>
        <div style={styles.body}>
          {/* SONG LIST */}
          <div style={styles.songList}>
            <h1>Songs</h1>
            <div style={{ display: "flex", flexDirection: "row" }}>
              {/* NEW SONG BUTTON */}
              <div
                style={styles.newSongButton}
                onClick={() => {
                  this.newSongClicked();
                }}
              >
                <FaPlus size={70} color="grey" />
              </div>
              {this.state.songs.map((song) => (
                <SongItem
                  title={song}
                  onClick={() => {
                    console.log("this one clicked: ", song);
                    this.openSong(song);
                  }}
                />
              ))}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <Link to="/tabcreator">To Tabs screen</Link>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * Redux Functions
 */
const mapDispatchToProps = (dispatch) => {
  return {
    openSong: (data) => dispatch({ type: "OPENSONG", data: data }),
    openNewSong: () => dispatch({ type: "OPENNEWSONG" }),
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
  homeContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    height: "100vh",
  },
  header: {
    ...divCenteredContent,
    boxShadow: "0px 5px 5px grey",
    height: 60,
    width: "100%",
    backgroundColor: "white",
  },
  body: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  songList: {
    flex: 1,
    textAlign: "left",
    padding: 10,
  },
  newSongButton: {
    width: 250,
    height: 400,
    margin: 5,
    borderRadius: 10,
    border: "2px dotted grey",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default connect(null, mapDispatchToProps)(HomeScreen);
