'use strict'

window.onload = () => {
  data = JSON.parse(document.getElementById('data').textContent);
  makeGrid(data.gridSize);
  data.clueList.forEach(parseJson);
  data.clueList.forEach(clueNumber);
  addListeners();
}

let data = {};
let wordList = [];
let currentWord = [];

function findWord(cell) {
  /* Finds word from cell */
  let thisWord = [];
  wordList.forEach((word) => {
    word.forEach((letter) => {
      if (letter[1] === cell) {
        thisWord.push(word);
      }
    })
  })
  return thisWord;
}

function addListeners() {
  const inputs = document.querySelectorAll('input');
  inputs.forEach((input) => {
    input.addEventListener('click', () => {
      deSelect();
      const cell = Number(input.closest('span').getAttribute('id').replace('grid-item-', ''));
      selectWord(cell);
    })

    input.addEventListener('keypress', (e) => {
      // If another letter is put in, change it immediately
      input.value = e.key;
      moveFocus(e.target.closest('span'))
    })
  })
  document.querySelector('#clues').addEventListener('click', selectClue);
  document.querySelector('#solve').addEventListener('click', solve);
  document.querySelector('#check').addEventListener('click', check);
}

function solve() {
  /* Fills in grid with answers */
  if (confirm('Reveal all solutions?')) {
    wordList.forEach((item) => {
      item.forEach((letter) => {
        const answer = '#grid-item-' + letter[1] + ' > input';
        document.querySelector(answer).value = letter[0];
      })
    })
  }
}

function check() {
  /* Deletes wrong letters */
  wordList.forEach((item) => {
    item.forEach((letter) => {
      const val = document.querySelector('#grid-item-' + letter[1] + ' > input');
      const ans = letter[0];
      if (val.value.toUpperCase() !== ans && val.value !== '') {
        val.value = '';    
      }
    })
  })
}

function moveFocus(span) {
  /* Moves cursor to next cell after inserting letter */
  const cell = Number(span.getAttribute('id').replace('grid-item-', ''));
  currentWord.find((letter) => letter === cell);
  const diff = currentWord[1] - currentWord[0]; // Across or down?
  document.querySelector('#grid-item-' + (cell + diff) + ' > input').focus();
}

function deSelect() {
  /* Reset any previously selected words or cells */
  const tmp = document.querySelectorAll('.grid-item > input')
  tmp.forEach((item) => {
    item.style.boxShadow  = 'none';
  })

}
function clueNumber(item) {
  /* Fills in the clue numbers in first cell */
  const cell = item.y * data.gridSize + item.x;
  if (document.querySelector('#grid-item-' 
    + cell).querySelector('.clueNo') === null) {
    document.querySelector('#grid-item-' 
      + cell).innerHTML += '<span class="clueNo">' 
      + item.clueNo 
      + '</span>';
  }
}

function selectWord(cell, dir) {
  /* Selects word in grid when clue clicked */
  deSelect();
  currentWord = [];
  let clue = [];
  const word = findWord(cell);
  if (dir === undefined) { dir = 'a' };
  if (dir === 'a') { dir = 0 }
  else { dir = 1 };
  /* Seems a bit of a hacky way to do it.
   * Goes for across first, if there's 2 words in array (across and down) go for 2nd unless
   * there's only down */

  if (word[dir] === undefined) { dir = 0 };
  word[dir].forEach((letter) => {
    document.querySelector('#grid-item-' + letter[1] + '> input').style.boxShadow = '0 0 7px 7px #dddddd inset';
    currentWord.push(letter[1]);
    clue.push(letter[0]);
  })
  // Puts clue in curentClue div
  clue = clue.join('');
  data.clueList.forEach((item) => {
    if (item.solution === clue) {
      document.querySelector('#currentClue').innerHTML = item.clueNo + item.dir + ': ' + item.clue;
    }
  })
}

function selectClue(e) {
  /* Returns first cell of word when user clicks clue list */
  let id = e.target.getAttribute('id').split('');
  const dir = id.pop();
  id = Number(id.join(''));
  data.clueList.forEach((item) => {
    if (item.clueNo === id && item.dir === dir) {
      const cell = item.y * data.gridSize + item.x;
      selectWord(cell, dir);
      document.querySelector('#grid-item-' + cell + ' > input').focus();
    }
  })  
}

function makeGrid(gridSize) {
  /* Creates blank grid */
  document.querySelector('#xword-grid').style.gridTemplate += 'repeat(' 
    + gridSize 
    + ', 1fr)/repeat('
    + gridSize + ', 1fr)';
  for (let i = 0; i < gridSize ** 2 ; i++) {
    document.querySelector('#xword-grid').innerHTML += 
      '<span class="grid-item" id="grid-item-'
      + i 
      + '"></span>'
  }
}

function parseJson (item) {
  /* Fills in grid with input elements and creates clue list */
  let word = [];
  const clue = document.querySelector('#clue-list');
  clue.innerHTML += 
    '<li id="' + item.clueNo + item.dir + '">' 
    + '<span class="bold">' 
    + item.clueNo 
    + item.dir
    + ': </span>' 
    + item.clue 
    + ' (' 
    + item.solution.length 
    + ')</li>';  

  for (let j = 0; j < item.solution.length; j++) {
    /* Iterates through solution putting input element in cell */
    if (item.dir === 'a') {
      document.querySelector('#grid-item-' 
        + (item.y * data.gridSize 
          + item.x 
          + j))
        .innerHTML = '<input type="text" size="1" maxlength="1">';
      word.push([item.solution[j], (item.y * data.gridSize 
        + item.x + j )]);

    } else {
      document.querySelector('#grid-item-' 
        + (item.y * data.gridSize 
          + item.x 
          + (j * data.gridSize)))
        .innerHTML = '<input type="text" size="1" maxlength="1">'
      word.push([item.solution[j], (item.y * data.gridSize 
        + item.x 
        + (j * data.gridSize))]);
    }
  }
  wordList.push(word);
}
