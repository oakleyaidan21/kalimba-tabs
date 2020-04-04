import Quarter from "../noteImages/quarter_note.png";
import Eighth from "../noteImages/eighth_note.png";
import Half from "../noteImages/half_note.png";
import Sixteenth from "../noteImages/sixteenth_note.png";
import D_Half from "../noteImages/dotted_half.png";
import D_Eighth from "../noteImages/dotted_eighth.png";
import D_Quarter from "../noteImages/dotted_quarter.png";
import Whole from "../noteImages/whole_note.png";

let array = [];

for (let i = 0; i < 17; i++) {
  array.push([]);
  for (let j = 0; j < 200; j++) {
    array[i].push({ note: "", time: 0 });
  }
}

//initial state for redux store
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
};

//image map
export const images = [
  { time: 1, image: Whole },
  { time: 4 / 3, image: D_Half },
  { time: 2, image: Half },
  { time: 8 / 3, image: D_Quarter },
  { time: 4, image: Quarter },
  { time: 16 / 3, image: D_Eighth },
  { time: 8, image: Eighth },
  { time: 16, image: Sixteenth },
];
