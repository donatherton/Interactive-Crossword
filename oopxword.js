'use strict'

class CrossWord {
  constructor() {
    this.data = JSON.parse(document.getElementById('data').textContent);
    this.wordList = [];
    this.currentWord = [];
  }

  init() {
    this.makeGrid(this.data.gridSize);
    this.data.clueList.forEach(item => this.parseJson(item));
    this.data.clueList.forEach(item => this.clueNumber(item));
    this.addListeners();
  }

  addListeners() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
      input.addEventListener('click', () => {
        this.selectWord(Number(input.parentElement.getAttribute('id').replace('grid-item-', '')));
      })

      input.addEventListener('keypress', e => this.moveFocus(e))
    })
    document.querySelector('#clues').addEventListener('click', e => this.selectClue(e));
    document.querySelector('#solve').addEventListener('click', e => this.solve(e));
    document.querySelector('#check').addEventListener('click', e => this.check(e));
  }

  findWord(cell) {
    /* Finds word from cell */
    let thisWord = [];
    this.wordList.forEach((word) => {
      word.forEach((letter) => {
        if (letter[1] === cell) {
          thisWord.push(word);
        }
      })
    })
    return thisWord;
  }

  solve() {
    /* Fills in grid with answers */
    if (confirm('Reveal all solutions?')) {
      this.wordList.forEach((item) => {
        item.forEach((letter) => {
          document.querySelector('#grid-item-' + letter[1]).firstElementChild.value = letter[0];
        })
      })
    }
  }

  check() {
    /* Deletes wrong letters */
    this.wordList.forEach((item) => {
      item.forEach((letter) => {
        const val = document.querySelector('#grid-item-' + letter[1]).firstElementChild;
        const ans = letter[0];
        if (val.value.toUpperCase() !== ans && val.value !== '') {
          val.value = '';    
        }
      })
    })
  }

  moveFocus(e) {
    /* Moves cursor to next cell after inserting letter */
    // If another letter is put in, change it immediately
    e.target.value = e.key;
    const span = e.target.parentElement
    const cell = Number(span.getAttribute('id').replace('grid-item-', ''));
    this.currentWord.find((letter) => letter === cell);
    const diff = this.currentWord[1] - this.currentWord[0]; // Across or down?
    try {
      document.querySelector('#grid-item-' + (cell + diff)).firstElementChild.focus();
    }
    catch(err) {
      console.log('End of word');
    }
  }

  deSelect() {
    /* Reset any previously selected words or cells */
    const tmp = document.querySelectorAll('.grid-item > input')
    tmp.forEach((item) => {
      item.style.boxShadow  = 'none';
    })
  }

  clueNumber(item) {
    /* Fills in the clue numbers in first cell */
    const cell = item.y * this.data.gridSize + item.x;
    if (document.querySelector('#grid-item-' + cell).querySelector('.clueNo') === null) {
      document.querySelector('#grid-item-' + cell).innerHTML += '<span class="clueNo">' 
        + item.clueNo 
        + '</span>';
    }
  }

  selectWord(cell, dir='a') {
    /* Selects word in grid when clue clicked */
    this.deSelect();
    this.currentWord = [];
    let clue = [];
    let wordNum;
    const word = this.findWord(cell);
    // If up and down words in cell word will be 2 arrays
    word.length === 2 && dir === 'd' ? wordNum = 1 : wordNum = 0;
    word[wordNum].forEach((letter) => {
      document.querySelector('#grid-item-' + letter[1]).firstElementChild.style.boxShadow = '0 0 7px 7px #dddddd inset';
      this.currentWord.push(letter[1]);
      clue.push(letter[0]);
    })
    // Puts clue in curentClue div
    clue = clue.join('');
    this.data.clueList.forEach((item) => {
      if (item.solution === clue) {
        document.querySelector('#currentClue').innerHTML = item.clueNo + item.dir + ': ' + item.clue;
      }
    })
  }

  selectClue(e) {
    /* Returns first cell of word when user clicks clue list */
    let id = e.target.getAttribute('id').split('');
    const dir = id.pop();
    id = Number(id.join(''));
    //this.data.clueList.forEach((item) => 
    const item = this.data.clueList;
    for (let i = 0; i < item.length; i++) {
      if (item[i].clueNo === id && item[i].dir === dir) {
        const cell = item[i].y * this.data.gridSize + item[i].x;
        this.selectWord(cell, dir);
        document.querySelector('#grid-item-' + cell).firstElementChild.focus();
      }
    }  
  }

  makeGrid(gridSize) {
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

  parseJson(item) {
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
          + (item.y * this.data.gridSize 
            + item.x 
            + i))
          .innerHTML = '<input type="text" size="1" maxlength="1">';
        word.push([item.solution[i], (item.y * this.data.gridSize 
          + item.x + i )]);

      } else {
        document.querySelector('#grid-item-' 
          + (item.y * this.data.gridSize 
            + item.x 
            + (i * this.data.gridSize)))
          .innerHTML = '<input type="text" size="1" maxlength="1">'
        word.push([item.solution[i], (item.y * this.data.gridSize 
          + item.x 
          + (i * this.data.gridSize))]);
      }
    }
    this.wordList.push(word);
  }
}

window.onload = () => {
  let crossWord = new CrossWord();
  crossWord.init()
}
