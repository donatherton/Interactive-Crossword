'use strict';

window.onload = () => {
  const data = JSON.parse(document.getElementById('data').textContent);
  let wordList = [];
  let currentWord = {
    'dir': '',
    'word': []
  };

  makeGrid(data.gridSize);
  data.clueList.forEach(parseJson);
  data.clueList.forEach(clueNumber);
  addListeners();

  function addListeners() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
      input.addEventListener('click', () => 
        selectWord(Number(input.parentElement.getAttribute('id').replace('grid-item-', '')))
      )
      input.addEventListener('keydown', deleteValue);
      input.addEventListener('input', moveFocus);
    })
    document.querySelector('#clues').addEventListener('click', selectClue);
    document.querySelector('#solve').addEventListener('click', solve);
    document.querySelector('#check').addEventListener('click', check);
  }

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

  function solve() {
    /* Fills in grid with answers */
    if (confirm('Reveal all solutions?')) {
      wordList.forEach((item) => {
        item.forEach((letter) => {
          document.querySelector('#grid-item-' + letter[1]).firstElementChild.value = letter[0];
        })
      })
    }
  }

  function check() {
    /* Deletes wrong letters */
    wordList.forEach((item) => {
      item.forEach((letter) => {
        const val = document.querySelector('#grid-item-' + letter[1]).firstElementChild;
        const ans = letter[0];
        if (val.value.toUpperCase() !== ans && val.value !== '') {
          val.value = '';    
        }
      })
    })
  }

  function deleteValue(e) {
    /* Android keyboard doesn't get key with e on keydown/up
     * so have to use input event, but to make it still
     * change after cell already populated have to empty cell first */
    e.target.value = null;  
  }

  function moveFocus(e) {
    /* Moves cursor to next cell after inserting letter */
    // Android doesn't respect maxlength
    if (e.target.value.length > 1) e.target.value = e.target.value.slice(-1);
    const span = e.target.parentElement;
    const cell = Number(span.getAttribute('id').replace('grid-item-', ''));
    const diff = currentWord.word[1] - currentWord.word[0]; // Across or down?
    if (currentWord.word.indexOf(cell) < currentWord.word.length - 1) {
      document.querySelector('#grid-item-' + (cell + diff)).firstElementChild.focus();
    }
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
    /* Selects word in grid when clue or cell clicked and puts current clue in currentClue div */
    deSelect();
    currentWord.word = [];
    let clue = [];
    let wordNum;
    const word = findWord(cell);
    // If up and down words in cell word will be 2 arrays. Cycle between them
    let tmp;
    if (word.length === 2 && (dir === 'd' || (currentWord.dir === 'a' && dir !== 'a'))) {
      wordNum = 1;
      tmp = 'd';
    } else {
      wordNum = 0;
      tmp = 'a';
    }
    if (dir === undefined) {
      currentWord.dir = tmp;
    } else {
      currentWord.dir = dir;
    }
    word[wordNum].forEach((letter) => {
      document.querySelector('#grid-item-' 
        + letter[1]).firstElementChild.style.boxShadow = '0 0 7px 7px #dddddd inset';
      currentWord.word.push(letter[1]);
      clue.push(letter[0]);
    });
    currentClue(clue);
  }

  function currentClue(clue) {
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
        document.querySelector('#grid-item-' + cell).firstElementChild.focus();
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

    for (let i = 0; i < item.solution.length; i++) {
      /* Iterates through solution putting input element in cell */
      if (item.dir === 'a') {
        document.querySelector('#grid-item-' 
          + (item.y * data.gridSize 
            + item.x 
            + i))
          .innerHTML = '<input type="text" size="1" maxlength="1">';
        word.push([item.solution[i], (item.y * data.gridSize 
          + item.x + i )]);

      } else {
        document.querySelector('#grid-item-' 
          + (item.y * data.gridSize 
            + item.x 
            + (i * data.gridSize)))
          .innerHTML = '<input type="text" size="1" maxlength="1">'
        word.push([item.solution[i], (item.y * data.gridSize 
          + item.x 
          + (i * data.gridSize))]);
      }
    }
    wordList.push(word);
  }
}
