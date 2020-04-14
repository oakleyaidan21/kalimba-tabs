import {
  initialState,
  findAccidentals,
} from "../constants/kalimbaConstants.js";

/**
 * Edits the song array in the redux store
 * changes values of note in the array according
 * to redux variables
 * @param {object} state the redux state object
 * @param {object} note the note clicked
 * @return {object} the new state
 */
const editSong = (state, note) => {
  let newSong = [...state.song];
  if (newSong[note.noteIndex][note.tineIndex].note !== "") {
    //remove from song
    newSong[note.noteIndex][note.tineIndex] = {
      note: "",
      time: 0,
      tripletMode: false,
    };
  } else {
    //add to song
    //check accidental
    let noteToAdd = note.tine;
    let timeToAdd = state.selectedNote;
    if (state.selectedAccidental === "♯") {
      if (findAccidentals(noteToAdd) !== "♯") {
        if (noteToAdd.length === 3) {
          noteToAdd = noteToAdd[0] + "#" + noteToAdd[2];
        } else {
          noteToAdd = noteToAdd[0] + "#" + noteToAdd[1];
        }
      }
    }
    if (state.selectedAccidental === "♭") {
      if (findAccidentals(noteToAdd) !== "♭") {
        if (noteToAdd.length === 3) {
          noteToAdd = noteToAdd[0] + "b" + noteToAdd[2];
        } else {
          noteToAdd = noteToAdd[0] + "b" + noteToAdd[1];
        }
      }
    }
    if (state.selectedAccidental === "♮") {
      noteToAdd = noteToAdd.replace("#", "").replace("b", "");
    }
    //check if triplet mode is activated
    if (state.tripletMode) {
      timeToAdd = timeToAdd * 3;
    }
    if (state.dotted) {
      timeToAdd = (timeToAdd + timeToAdd) / 3;
    }
    if (state.rest) {
      noteToAdd = "rest";
    }
    newSong[note.noteIndex][note.tineIndex] = {
      note: noteToAdd,
      time: timeToAdd,
      tripletMode: state.tripletMode,
    };
  }
  return { ...state, song: newSong, lastNoteIndex: note.noteIndex };
};

const getInitialState = () => {
  return initialState;
};

/**
 *
 * Changes the key signature on the bottom of the kalimba
 *
 * @param {object} state the current redux state
 * @param {object} action the action passed up from children
 * @return {object} the new redux state
 */
const changeKey = (state, action) => {
  let indexOfTine = state.tineNotes.indexOf(action.tine);
  if (indexOfTine === -1) {
    console.log("error finding tine");
    return { ...state };
  }
  let newNote = state.tineNotes[indexOfTine];
  newNote = newNote.replace("#", "").replace("b", "");
  if (action.accidental === "♯") {
    newNote = newNote[0] + "#" + newNote[1];
  }
  if (action.accidental === "♭") {
    newNote = newNote[0] + "b" + newNote[1];
  }
  let newTines = [...state.tineNotes];
  newTines[indexOfTine] = newNote;
  return { ...state, tineNotes: newTines };
};

/**
 *
 * Reducer for the redux store. Returns a new state based on the action given by dispatch
 *
 * @param {object} state the initial state of a new song
 * @param {object} action  the parameters passed from dipatch
 */
export const reducer = (state = getInitialState(), action) => {
  switch (action.type) {
    case "NOTECLICKED":
      return editSong(state, action.noteDetails);

    case "CHANGENOTEVALUE":
      return { ...state, selectedNote: action.value };

    case "CHANGESELECTEDACCIDENTAL":
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
        tineNotes: action.data.tineNotes,
      };
    }

    case "CHANGETITLE": {
      return { ...state, songTitle: action.title };
    }

    case "CHANGEKEY": {
      return changeKey(state, action);
    }

    case "TOGGLEREST": {
      return { ...state, rest: !state.rest };
    }

    case "CHANGETEMPO": {
      return { ...state, tempo: action.tempo };
    }

    case "OPENNEWSONG": {
      return { ...getInitialState() };
    }

    case "TOGGLETRIPLET": {
      return { ...state, tripletMode: !state.tripletMode };
    }

    case "ADDROW": {
      let newSong = [...state.song];
      let newRow = [];
      for (let i = 0; i < 17; i++) {
        newRow.push({ note: "", time: 0, tripletMode: false });
      }
      newSong.splice(action.noteIndex, 0, newRow);
      return { ...state, song: newSong };
    }

    case "REMOVEROW": {
      let newSong = [...state.song];
      newSong.splice(action.noteIndex, 1);
      return { ...state, song: newSong };
    }

    case "EXTENDSONG": {
      console.log("extending song...");
      let newSong = [...state.song];
      let newRow = [];
      for (let i = 0; i < 17; i++) {
        newRow.push({ note: "", time: 0, tripletMode: false });
      }
      for (let i = 0; i < 50; i++) {
        newSong.unshift(newRow);
      }
      console.log(newSong.length);
      return { ...state, song: newSong };
    }

    case "TOGGLESELECTIONMODE": {
      return { ...state, selectionMode: !state.selectionMode };
    }

    default:
      return state;
  }
};
