'use strict'
window.onload = () => {
	makeGrid(jsObj.gridSize);
	jsObj.clueList.forEach(parseJson);
	jsObj.clueList.forEach(clueNumber);
	//moveFocus();
	addListeners();
}
let wordList = [];

function addListeners() {
	const inputs = document.querySelectorAll('input');
	inputs.forEach((input) => {
		input.addEventListener('focus', () => {

			deSelect();

			input.style.boxShadow = '0 0 7px 7px #dddddd inset';
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
	wordList.forEach((item) => {
		item.forEach((letter) => {
			const answer  = '#grid-item-' + letter[1] + ' > input';
			document.querySelector(answer).value = letter[0];
		})
	})
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
	// Moves cursor to next cell after inserting letter */
	const id = Number(span.id.replace('grid-item-', ''));
	wordList.forEach((item) => {
		if (id === item[0][1]) {
			document.querySelector('#grid-item-' + (id + 1) + ' > input').focus();
		}
	})
}

function deSelect() {
	// Reset any previously selected words or cells
	const tmp = document.querySelectorAll('.grid-item > input')
	tmp.forEach((item) => {
		item.style.boxShadow  = 'none';
	})

}
function clueNumber(item) {
	/* Fills in the clue numbers in first cell */
	const cell = item.y * jsObj.gridSize + item.x;
	if (document.querySelector('#grid-item-' + cell).querySelector('.clueNo') === null) {
		document.querySelector('#grid-item-' + cell).innerHTML += '<span class="clueNo">' 
			+ item.clueNo 
			+ '</span>';
	}
}

function selectWord(item, dir) {
	/* Selects word in grid when clue clicked */
	deSelect();
	const cell = item.y * jsObj.gridSize + item.x;
	const wd = item.solution.length;
	if (dir == 'a') {
		for (let i = 0; i < wd; i++) {
			document.querySelector('#grid-item-' + (cell) + '> input').focus();
			document.querySelector('#grid-item-' + (cell + i) + '> input').style.boxShadow = '0 0 7px 7px #dddddd inset';
		}
	} else {
		{
			for (let i = 0; i < wd; i++) {
				document.querySelector('#grid-item-' + (cell) + '> input').focus();
				document.querySelector('#grid-item-' + (cell + i * jsObj.gridSize) + '> input').style.boxShadow = '0 0 7px 7px #dddddd inset';
			}
		}
	}
}

function selectClue(e) {
	/* Returns first cell of word when user clicks clue list 
		and prints clue in currentClue div */
	let id = e.target.getAttribute('id').split('');
	const dir = id.pop();
	id = Number(id.join(''));
	jsObj.clueList.forEach((item) => {
		if (item.clueNo === id && item.dir === dir) {
			selectWord(item, dir);
			document.querySelector('#currentClue').innerHTML = item.clueNo + item.dir + ': ' + item.clue;
		}
	})	
}

function makeGrid(gridSize) {
	/* Creates blank grid */
	for (let i = 0; i < gridSize ** 2 ; i++) {
		document.querySelector('#container').innerHTML += 
			'<span class="grid-item" id="grid-item-'
			+ i 
			+ '"></span>'
	}
}

function parseJson (item) {
	/* Fills in grid with input elements and creates clue list */
	let solution = '';
	let word = [];
	const clue = document.querySelector('#clues');
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
				+ (item.y * jsObj.gridSize 
					+ item.x 
					+ j))
				.innerHTML = '<input type="text" size="1" maxlength="1" placeholder = "' + item.solution[j] + '">';
				word.push([item.solution[j], (item.y * jsObj.gridSize 
					+ item.x + j )]);

		} else {
			document.querySelector('#grid-item-' 
				+ (item.y * jsObj.gridSize 
					+ item.x 
					+ (j * jsObj.gridSize)))
				.innerHTML = '<input type="text" size="1" maxlength="1" placeholder = "' + item.solution[j] + '">'
				word.push([item.solution[j], (item.y * jsObj.gridSize 
					+ item.x 
					+ (j * jsObj.gridSize))]);
		}
	}
	wordList.push(word);
}
