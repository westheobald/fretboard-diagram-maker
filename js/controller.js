const diagram = document.querySelector('.note-container');
const grid = document.querySelector('.grid-background');

const numOfStrings = 6;
const numOfFrets = 5;

let currentString = 1;
let currentFret = 1;

const savedChord = [];

while (currentFret <= numOfFrets) {
  while (currentString <= numOfStrings) {
    const markup = `
      <svg class="note" data-string="${currentString}" data-fret="${currentFret}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50"/>
      </svg>
      `;
    // <div class="note" data-string="${currentString}" data-fret="${currentFret}"></div>
    diagram.insertAdjacentHTML('beforeend', markup);
    currentString += 1;
  }
  currentFret += 1;
  currentString = 1;
}

currentFret = 0;
let markup;
while (currentFret < numOfStrings * numOfFrets) {
  if (currentFret % 6 === 0) {
    markup = '<div class="grid__el grid__el--last-row"></div>';
  } else {
    markup = '<div class="grid__el"></div>';
  }
  grid.insertAdjacentHTML('beforeend', markup);
  currentFret += 1;
}

diagram.style.gridTemplateColumns = `repeat(${numOfStrings}, 1fr)`;
diagram.style.gridTemplateRows = `repeat(${numOfFrets}, 1fr)`;

grid.style.gridTemplateColumns = `repeat(${numOfStrings}, 1fr)`;
grid.style.gridTemplateRows = `repeat(${numOfFrets}, 1fr)`;

diagram.addEventListener('click', (e) => {
  if (e.target.closest('.note')) {
    const string = e.target.closest('.note').dataset.string;
    const fret = e.target.closest('.note').dataset.fret;

    if (e.target.closest('.note').classList.contains('note--on')) {
      e.target.closest('.note').classList.remove('note--on');
      const index = savedChord.indexOf([string, fret]);
    } else {
      e.target.closest('.note').classList.add('note--on');
      savedChord.push([string, fret]);
    }
    console.log(savedChord);
  }
});
