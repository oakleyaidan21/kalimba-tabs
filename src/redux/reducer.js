import { initialState } from "../constants/kalimbaConstants.js";

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "NOTECLICKED":
      let newSong = state.song;
      if (action.noteDetails.wasClicked) {
        //remove from song
        newSong[action.noteDetails.tineIndex][action.noteDetails.noteIndex] = {
          note: "",
          time: 0
        };
      } else {
        //add to song
        //check accidental
        let noteToAdd = action.noteDetails.tine;
        if (state.selectedAccidental === "♯") {
          noteToAdd = noteToAdd[0] + "#" + noteToAdd[1];
        }
        if (state.selectedAccidental === "♭") {
          noteToAdd = noteToAdd[0] + "b" + noteToAdd[1];
        }
        if (state.selectedAccidental === "♮") {
          noteToAdd = noteToAdd.replace("#", "").replace("b", "");
        }
        newSong[action.noteDetails.tineIndex][action.noteDetails.noteIndex] = {
          note: noteToAdd,
          time: action.noteDetails.time
        };
      }
      return { ...state, song: newSong };
    case "CHANGENOTEVALUE":
      return { ...state, selectedNote: action.value };
    case "CHANGEACCIDENTAL":
      if (state.selectedAccidental === action.accidental) {
        return { ...state, selectedAccidental: "None" };
      }
      return { ...state, selectedAccidental: action.accidental };
    case "TOGGLEDOTTED": {
      return { ...state, dotted: !state.dotted };
    }
    case "OPENSONG": {
      return { ...state, song: action.data };
    }
    case "CHANGETITLE": {
      return { ...state, songTitle: action.title };
    }
    default:
      return state;
  }
};
