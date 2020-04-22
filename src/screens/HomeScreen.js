import React, { Component } from "react";
import SongItem from "../components/SongItem";
import { connect } from "react-redux";
import { FaPlus } from "react-icons/fa";
import { exampleSongs } from "../constants/tab_examples.js";

var app = window.require("electron").remote;
const fs = app.require("fs");

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pressed: false,
      yourSongs: [],
      exampleSongs: [],
    };
  }

  /**
   * Reads a file from the KalimbaTabs folder based on its title
   * Then navigates to
   * @param {string} title The title of the desired song to open
   */
  openSong = (title, location) => {
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

  getSongs = (docpath) => {
    // get your songs from folder
    fs.readdir(docpath, (err, files) => {
      if (err) {
        alert(err);
        return;
      }
      //only show .kal files
      let songs = files.filter((fileName) => {
        return fileName.includes(".kal");
      });
      this.setState({ yourSongs: songs });
    });
  };

  componentDidMount = () => {
    // set up tabs folder
    let docpath = app.app.getPath("documents") + "/KalimbaTabs";
    if (!fs.existsSync(docpath)) {
      fs.mkdir(docpath, (err) => {
        if (err) alert(err);
      });
    }
    this.getSongs(docpath);
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

  deleteSong = (songTitle) => {
    let docpath = app.app.getPath("documents") + "/KalimbaTabs/";
    let toDelete = window.confirm(
      "Are you sure you want to delete " + songTitle + "?"
    );
    if (toDelete) {
      fs.unlink(docpath + songTitle, (err) => {
        if (err) throw err;
        this.getSongs(docpath);
      });
    }
  };

  render() {
    return (
      <div style={styles.homeContainer}>
        <div style={styles.body}>
          {/* SONG LIST */}
          <div style={styles.songList}>
            <h1>Your Songs</h1>
            <div style={styles.linebreak} />
            <div style={{ display: "flex", flexDirection: "row" }}>
              {/* NEW SONG BUTTON */}
              <div
                style={styles.newSongButton}
                onClick={() => {
                  this.newSongClicked();
                }}
              >
                <FaPlus size={70} color="black" />
              </div>
              {this.state.yourSongs.map((songTitle) => (
                <SongItem
                  title={songTitle}
                  onClick={() => {
                    this.openSong(songTitle);
                  }}
                  onDeleteClicked={() => {
                    this.deleteSong(songTitle);
                  }}
                />
              ))}
            </div>
            <h1>Example Songs</h1>
            <div style={styles.linebreak} />
            <div style={{ display: "flex", flexDirection: "row" }}>
              {exampleSongs.map((song) => (
                <SongItem
                  title={song.songTitle}
                  onClick={() => {
                    this.props.openSong(song);
                    this.props.history.push("/tabcreator");
                  }}
                />
              ))}
            </div>
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
    openSong: (data) => dispatch({ type: "OPEN_SONG", data: data }),
    openNewSong: () => dispatch({ type: "OPEN_NEW_SONG" }),
  };
};

/**
 * Styling
 */
// const divCenteredContent = {
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   flexDirection: "row",
// };

const styles = {
  homeContainer: {
    overflow: "auto",
    display: "flex",
    flex: 1,
    flexDirection: "column",
    height: "100vh",
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
    height: 300,
    margin: 5,
    borderRadius: 10,
    border: "2px solid black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  linebreak: {
    width: "99%",
    height: 3,
    backgroundColor: "#60a1fc",
    margin: 5,
  },
};

export default connect(null, mapDispatchToProps)(HomeScreen);
