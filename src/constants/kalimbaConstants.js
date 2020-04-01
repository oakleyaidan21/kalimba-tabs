let array = [];

for (let i = 0; i < 17; i++) {
  array.push([]);
  for (let j = 0; j < 200; j++) {
    array[i].push({ note: "", time: 0 });
  }
}

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
    "E6"
  ],
  song: array
};
