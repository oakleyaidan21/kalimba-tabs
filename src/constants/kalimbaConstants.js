import Quarter from "../kalimbaImages/noteImages/quarter_note.png";
import Eighth from "../kalimbaImages/noteImages/eighth_note.png";
import Half from "../kalimbaImages/noteImages/half_note.png";
import Sixteenth from "../kalimbaImages/noteImages/sixteenth_note.png";
import D_Half from "../kalimbaImages/noteImages/dotted_half.png";
import D_Eighth from "../kalimbaImages/noteImages/dotted_eighth.png";
import D_Quarter from "../kalimbaImages/noteImages/dotted_quarter.png";
import D_Sixteenth from "../kalimbaImages/noteImages/dotted_sixteenth_note.png";
import D_Whole from "../kalimbaImages/noteImages/dotted_whole_note.png";
import Whole from "../kalimbaImages/noteImages/whole_note.png";

import R_Quarter from "../kalimbaImages/restImages/quarter_rest.png";
import R_Eighth from "../kalimbaImages/restImages/eighth_rest.png";
import R_Half from "../kalimbaImages/restImages/half_rest.png";
import R_Whole from "../kalimbaImages/restImages/whole_rest.png";
import R_Sixteenth from "../kalimbaImages/restImages/sixteenth_rest.png";
import R_D_Whole from "../kalimbaImages/restImages/dotted_whole_rest.png";
import R_D_Quarter from "../kalimbaImages/restImages/dotted_quarter_rest.png";
import R_D_Half from "../kalimbaImages/restImages/dotted_half_rest.png";
import R_D_Eighth from "../kalimbaImages/restImages/dotted_eighth_rest.png";
import R_D_Sixteenth from "../kalimbaImages/restImages/dotted_sixteenth_rest.png";

let array = [];

for (let i = 0; i < 200; i++) {
  array.push([]);
  for (let j = 0; j < 17; j++) {
    array[i].push({ note: "", time: 0, tripletMode: false });
  }
}

/**
 * Initial state of the redux store
 * @tineNotes the 17 note names on the bottom of the kalimba
 * @song the multi dimensional array containing all of the note objects
 * @selectedNote the currently selected note timing, i.e. quarter, eighth
 * @tempo the tempo of the song in bpm
 * @songTitle the title of the song
 * @selectedAccidental the currently selected accidental, i.e. sharp, flat
 * @dotted a boolean representing whether or not the notes added are dotted
 * @rest a boolean representing whether or not the notes added are rests
 * @tripletMode a boolean representing whether or not triplet input mode is activated
 * @lastNoteIndex an integer representing the last edited note index
 */
export const initialState = {
  tineNotes: [
    "D6",
    "B5",
    "G5",
    "E5",
    "C5",
    "A4",
    "F4",
    "D4",
    "C4",
    "E4",
    "G4",
    "B4",
    "D5",
    "F5",
    "A5",
    "C6",
    "E6",
  ],
  song: array,
  selectedNote: 4,
  tempo: 145,
  songTitle: "Title",
  selectedAccidental: "None",
  dotted: false,
  rest: false,
  tripletMode: false,
  lastNoteIndex: 0,
  selectionMode: false,
  selectedRows: [],
};

/**
 * array with note timings and their corresponding note images
 */
export const noteImages = [
  { time: 2 / 3, image: D_Whole },
  { time: 1, image: Whole },
  { time: 4 / 3, image: D_Half },
  { time: 2, image: Half },
  { time: 8 / 3, image: D_Quarter },
  { time: 4, image: Quarter },
  { time: 16 / 3, image: D_Eighth },
  { time: 8, image: Eighth },
  { time: 32 / 3, image: D_Sixteenth },
  { time: 16, image: Sixteenth },
];

/**
 * array with note timings and their corresponding reste images
 */
export const restImages = [
  { time: 2 / 3, image: R_D_Whole },
  { time: 1, image: R_Whole },
  { time: 4 / 3, image: R_D_Half },
  { time: 2, image: R_Half },
  { time: 8 / 3, image: R_D_Quarter },
  { time: 4, image: R_Quarter },
  { time: 16 / 3, image: R_D_Eighth },
  { time: 8, image: R_Eighth },
  { time: 32 / 3, image: R_D_Sixteenth },
  { time: 16, image: R_Sixteenth },
];

/**
 * finds accidentals given a note name
 * @param {string} note the note name in question
 * @return {string} the accidental found in the note
 */
export const findAccidentals = (note) => {
  if (note.includes("#")) {
    return "♯";
  }
  if (note.includes("b")) {
    return "♭";
  }
  return "♮";
};
