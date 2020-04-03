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
        let timeToAdd = action.noteDetails.time;
        if (state.selectedAccidental === "♯") {
          noteToAdd = noteToAdd[0] + "#" + noteToAdd[1];
        }
        if (state.selectedAccidental === "♭") {
          noteToAdd = noteToAdd[0] + "b" + noteToAdd[1];
        }
        if (state.selectedAccidental === "♮") {
          noteToAdd = noteToAdd.replace("#", "").replace("b", "");
        }
        if (state.dotted) {
          timeToAdd = (timeToAdd * 2) / 3;
        }
        if (action.noteDetails.rest) {
          noteToAdd = "rest";
        }
        newSong[action.noteDetails.tineIndex][action.noteDetails.noteIndex] = {
          note: noteToAdd,
          time: timeToAdd
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
      return {
        ...state,
        song: action.data.song,
        songTitle: action.data.songTitle,
        tempo: action.data.tempo,
        tineNotes: action.data.tineNotes
      };
    }
    case "CHANGETITLE": {
      return { ...state, songTitle: action.title };
    }
    case "ADDACCIDENTAL": {
      //find note index in tine notes, then change accidental
      let indexOfTine = state.tineNotes.indexOf(action.tine);
      if (indexOfTine === -1) {
        console.log("error finding tine");
        return { ...state };
      }
      console.log(indexOfTine);
      let newNote = state.tineNotes[indexOfTine];
      console.log(newNote);
      newNote.replace("#", "").replace("b", "");
      if (action.accidental === "♯") {
        newNote = newNote[0] + "#" + newNote[1];
      }
      if (action.accidental === "♭") {
        newNote = newNote[0] + "b" + newNote[1];
      }
      console.log(newNote);
      let newTines = [...state.tineNotes];
      newTines[indexOfTine] = newNote;
      console.log(newTines);
      return { ...state, tineNotes: newTines };
    }
    case "TOGGLEREST": {
      return { ...state, rest: !state.rest };
    }
    case "CHANGETEMPO": {
      return { ...state, tempo: action.tempo };
    }
    default:
      return state;
  }
};
