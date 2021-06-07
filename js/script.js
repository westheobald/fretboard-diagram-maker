const state = {
  diagrams: 1,
};

function notesHTML(currentString, currentFret) {
  return `
    <svg class="note" data-string="${currentString}" data-fret="${currentFret}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50"/>
    </svg>
    `;
}
function gridHTML(currentString, currentFret) {
  if (currentString === 1 || currentFret === 0) {
    return '<div class="grid__el grid__el--no-border"></div>';
  }
  return '<div class="grid__el"></div>';
}

function renderDiagram(chord, numOfStrings, numOfFrets) {
  let notes = '';
  let grid = '';
  let currentFret = 0;
  let currentString = 1;

  while (currentFret <= numOfFrets) {
    while (currentString <= numOfStrings) {
      notes += notesHTML(currentString, currentFret);
      grid += gridHTML(currentString, currentFret);
      currentString += 1;
    }
    currentFret += 1;
    currentString = 1;
  }
  const noteContainer = chord.querySelector('.note-container');
  const gridContainer = chord.querySelector('.grid-background');
  noteContainer.insertAdjacentHTML('beforeend', notes);
  gridContainer.insertAdjacentHTML('beforeend', grid);

  noteContainer.style.gridTemplateColumns = `repeat(${numOfStrings}, 1fr)`;
  noteContainer.style.gridTemplateRows = `repeat(${numOfFrets + 1}, 1fr)`;
  gridContainer.style.gridTemplateColumns = `repeat(${numOfStrings}, 1fr)`;
  gridContainer.style.gridTemplateRows = `repeat(${numOfFrets + 1}, 1fr)`;
  const left = -27 + 3 * (numOfStrings - 1);
  gridContainer.style.left = `${left}px`;
}

function addNotes(chord) {
  chord.addEventListener('click', (e) => {
    const note = e.target.closest('.note');
    if (note) {
      if (+note.dataset.fret === 0) {
        note.classList.toggle('note--open');
      } else {
        note.classList.toggle('note--fretted');
      }
    }
  });
}
function reorderChords() {
  const diagrams = document.querySelectorAll('.diagram-container');
  let count = 1;
  diagrams.forEach((dia) => {
    const diagram = dia;
    diagram.id = `chord-${count}`;
    count += 1;
  });
}
function chordTools(chord) {
  chord.querySelector('.chord-tools').addEventListener('click', (e) => {
    if (e.target.closest('.icon-bin')) {
      const chordNumber = e.target.closest('.diagram-container');
      document.getElementById(chordNumber.id).remove();
      reorderChords();
    }
    if (e.target.closest('.arrow-left')) {
      if (chord.id === 'chord-1') return;
      const newChord = document.getElementById(
        `chord-${chord.id.charAt(chord.id.length - 1) - 1}`,
      );
      chord.parentNode.insertBefore(chord, newChord);
      reorderChords();
    }
    if (e.target.closest('.arrow-right')) {
      if (!chord.nextElementSibling.nextElementSibling) return;
      chord.parentNode.insertBefore(
        chord,
        chord.nextElementSibling.nextElementSibling,
      );
      reorderChords();
    }
  });
}

function addChord() {
  const form = document.querySelector('.diagram-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.querySelector('.error-message').classList.add('hidden');
    const strings = +form.querySelector('.num-strings').value;
    const frets = +form.querySelector('.num-frets').value;
    if (strings < 4 || strings > 7) {
      form.querySelector('.error-message').classList.remove('hidden');
      form.querySelector('.error-message').textContent =
        'Must be between 4 and 7 strings!';
      return;
    }
    if (frets < 1) {
      form.querySelector('.error-message').classList.remove('hidden');
      form.querySelector('.error-message').textContent =
        'Must have at least 1 fret!';
      return;
    }
    const markup = `
      <div class="diagram-container" id="chord-${state.diagrams}">
        <input type="text" class="chord-name" placeholder="Chord..." />
        <div class="chord-tools">
          <svg class="icon arrow-left"><use href="/images/sprites.svg#icon-arrow-left"></use></svg>       
          <svg class="icon arrow-right"><use href="/images/sprites.svg#icon-arrow-right"></use></svg>   
          <svg class="icon icon-bin"><use href="/images/sprites.svg#icon-bin"></use></svg>  
        </div>
        <div class="diagram" style="height: ${frets * 40}px">
          <input type="text" class="chord-fret" value="1" />
          <div class="grid note-container"></div>
          <div class="grid grid-background"></div>
        </div>
      </div>
      `;
    form.insertAdjacentHTML('beforeBegin', markup);
    const chord = document.getElementById(`chord-${state.diagrams}`);
    renderDiagram(chord, strings, frets);
    addNotes(chord);
    chordTools(chord);
    state.diagrams += 1;
  });
}
addChord();

document.querySelector('.icon-printer').addEventListener('click', () => {
  document.querySelectorAll('.chord-fret').forEach((fret) => {
    console.log(fret);
    if (fret.value === '1') {
      fret.classList.add('chord-fret--none');
    }
  });
  window.print();
});
