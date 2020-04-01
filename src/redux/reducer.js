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
        newSong[action.noteDetails.tineIndex][action.noteDetails.noteIndex] = {
          note: action.noteDetails.tine,
          time: action.noteDetails.time
        };
      }
      return { ...state, song: newSong };
    case "CHANGENOTEVALUE":
      return { ...state, selectedNote: action.value };
    default:
      return state;
  }
};
