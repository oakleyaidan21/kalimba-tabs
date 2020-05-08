import {
  initialState,
  findAccidentals,
} from "../constants/kalimbaConstants.js";

/**
 * Edits the song array in the redux store
 * changes values of note in the array according
 * to redux variables
 * if an index close to the end of the song is clicked, it extends the song length
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
    //extend song if it's close to the end
    if (note.noteIndex < 10) {
      let newRow = [];
      for (let i = 0; i < state.song[0].length; i++) {
        newRow.push({ note: "", time: 0, tripletMode: false });
      }
      for (let i = 0; i < 25; i++) {
        newSong.unshift([...newRow]);
      }
    }
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
 * @return {object} returns the new state
 */
export const reducer = (state = getInitialState(), action) => {
  switch (action.type) {
    case "NOTE_CLICKED":
      return editSong(state, action.noteDetails);

    case "CHANGE_NOTE_VALUE":
      return { ...state, selectedNote: action.value };

    case "CHANGE_SELECTED_ACCIDENTAL":
      if (state.selectedAccidental === action.accidental) {
        return { ...state, selectedAccidental: "None" };
      }
      return { ...state, selectedAccidental: action.accidental };

    case "TOGGLE_DOTTED": {
      return { ...state, dotted: !state.dotted };
    }

    case "OPEN_SONG": {
      return {
        ...state,
        song: action.data.song,
        songTitle: action.data.songTitle,
        tempo: action.data.tempo,
        tineNotes: action.data.tineNotes,
      };
    }

    case "CHANGE_NOTES": {
      return { ...state, tineNotes: action.notes };
    }

    case "CHANGE_TITLE": {
      return { ...state, songTitle: action.title };
    }

    case "CHANGE_KEY": {
      return changeKey(state, action);
    }

    case "TOGGLE_REST": {
      return { ...state, rest: !state.rest };
    }

    case "CHANGE_TEMPO": {
      return { ...state, tempo: action.tempo };
    }

    case "OPEN_NEW_SONG": {
      return { ...getInitialState(), song: [...initialState.song] };
    }

    case "NEW_SONG_FROM_PARAMETERS": {
      let song = [];
      for (let i = 0; i < 75; i++) {
        song.push([]);
        for (let j = 0; j < action.data.notes.length; j++) {
          song[i].push({ note: "", time: 0, tripletMode: false });
        }
      }
      return {
        ...state,
        song: song,
        tineNotes: action.data.notes,
        songTitle: action.data.title,
        tempo: action.data.tempo,
      };
    }

    case "TOGGLE_TRIPLET": {
      return { ...state, tripletMode: !state.tripletMode };
    }

    case "ADD_ROW": {
      let newSong = [...state.song];
      let newRow = [];
      for (let i = 0; i < state.song[0].length; i++) {
        newRow.push({ note: "", time: 0, tripletMode: false });
      }
      newSong.splice(action.noteIndex, 0, newRow);
      return { ...state, song: newSong };
    }

    case "REMOVE_ROW": {
      let newSong = [...state.song];
      newSong.splice(action.noteIndex, 1);
      return { ...state, song: newSong };
    }

    case "EXTEND_SONG": {
      let newSong = [...state.song];
      let newRow = [];
      for (let i = 0; i < state.song[0].length; i++) {
        newRow.push({ note: "", time: 0, tripletMode: false });
      }
      for (let i = 0; i < 50; i++) {
        newSong.unshift([...newRow]);
      }
      return { ...state, song: newSong };
    }

    case "TOGGLE_SELECTION_MODE": {
      if (state.selectionMode) {
        return {
          ...state,
          selectionMode: !state.selectionMode,
          selectedRows: [],
        };
      }
      return { ...state, selectionMode: !state.selectionMode };
    }

    case "SELECT_ROW": {
      let newSelectedRows = [...state.selectedRows];
      //check if row has already been highlighted
      for (let i = 0; i < newSelectedRows.length; i++) {
        if (newSelectedRows[i].noteIndex === action.noteIndex) {
          //remove it if it has
          newSelectedRows.splice(i, 1);
          return { ...state, selectedRows: newSelectedRows };
        }
      }
      let rowToPush = {
        noteIndex: action.noteIndex,
        notes: state.song[action.noteIndex],
      };
      newSelectedRows.push({
        ...rowToPush,
      });
      //sort array
      newSelectedRows.sort((a, b) => b.noteIndex - a.noteIndex);
      return { ...state, selectedRows: newSelectedRows };
    }

    case "PASTE_SELECTION": {
      let newSong = [...state.song];
      let selectedRows = [];
      for (let i = state.selectedRows.length - 1; i >= 0; i--) {
        selectedRows.push([...state.selectedRows[i].notes]);
      }

      newSong.splice(action.noteIndex, 0, ...selectedRows);
      return {
        ...state,
        song: newSong,
        selectedRows: [],
        selectionMode: false,
      };
    }

    case "HIDE_NOTE_BAR": {
      return { ...state, showNoteBar: false };
    }

    case "SHOW_NOTE_BAR": {
      return {
        ...state,
        showNoteBar: true,
        noteBarNoteIndex: action.noteIndex,
        noteBarTineIndex: action.tineIndex,
      };
    }

    case "NOTE_TEMPO_CHANGE": {
      let newSong = [...state.song];
      newSong[state.noteBarNoteIndex][state.noteBarTineIndex].tempo = parseInt(
        state.tempo
      );
      return { ...state, song: newSong };
    }

    default:
      return state;
  }
};
