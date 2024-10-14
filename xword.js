'use strict'
window.onload = () => {
	makeGrid(jsObj.gridSize);
	jsObj.clueList.forEach(parseJson);
	jsObj.clueList.forEach(clueNumber);
	//moveFocus();
	addListeners();
}

function addListeners() {
	const items = document.querySelectorAll('.grid-item');
	items.forEach((item) => {
		item.addEventListener('input', (e) => {console.log(e);
			/* Moves cursor to next cell after inserting letter */
			const id = Number(item.id.replace('grid-item-', ''));
			document.querySelector('#grid-item-' + (id + 1) + ' > input').focus();
		})
	})
	const inputs = document.querySelectorAll('input');
	inputs.forEach((input) => {
		input.addEventListener('focus', () => {

		deSelect();

		input.style.boxShadow = '2px 2px 4px 7px #dddddd inset';
		})
	})
}

//function moveFocus(item) {
//}


function makeGrid(gridSize) {
	/* Creates blank grid */
	for (let i = 0; i < gridSize ** 2 ; i++) {
		document.querySelector('#container').innerHTML += 
			'<span class="grid-item" id="grid-item-'
			+ i 
			+ '"></span>'
	}
}

function deSelect() {
	// Reset any previously selected words
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

function selectWord(item, id, dir) {
	/* Selects word in grid when cell */
	deSelect();
	const cell = item.y * jsObj.gridSize + item.x;
	const wd = item.solution.length;
	if (dir == 'a') {
		for (let i = 0; i < wd; i++) {
			document.querySelector('#grid-item-' + (cell) + '> input').focus();
			document.querySelector('#grid-item-' + (cell + i) + '> input').style.boxShadow = '2px 2px 4px 7px #dddddd inset';
		}
	} else {
		{
			for (let i = 0; i < wd; i++) {
				document.querySelector('#grid-item-' + (cell) + '> input').focus();
				document.querySelector('#grid-item-' + (cell + i * jsObj.gridSize) + '> input').style.boxShadow = '2px 2px 4px 7px #dddddd inset';
			}
		}
	}

}

function selectClue(e) {
	/* Returns first cell of word when user clicks clue list */
	let id = e.target.getAttribute('id').split('');
	const dir = id.pop();
	id = Number(id.join(''));
	jsObj.clueList.forEach((item) => {
		if (item.clueNo === id) {
			selectWord(item, id, dir);
		}
	})	
}

function parseJson (item) {
	/* Fills in grid with input elements and creates clue list */
	const clue = document.querySelector('#clues');
	clue.addEventListener('click', selectClue);
	clue.innerHTML += 
		'<li id="' + item.clueNo + item.dir + '">' 
		+ '<span class="bold">' 
		+ item.clueNo 
		+ item.dir
		+ ': </span>' 
		+ item.clue 
		+ ' (' 
		+ item.len 
		+ ')</li>';	

	for (let j = 0; j < item.solution.length; j++) {
		/* Iterates through solution putting input element in cell */
		if (item.dir === 'a') {
			document.querySelector('#grid-item-' 
				+ (item.y * jsObj.gridSize 
					+ item.x 
					+ j))
				.innerHTML = '<input type="text" size="1" maxlength="1" value="' 
				//+ item.solution[j] 
				+ '">'
		} else {
			document.querySelector('#grid-item-' 
				+ (item.y * jsObj.gridSize 
					+ item.x 
					+ (j * jsObj.gridSize)))
				.innerHTML = '<input type="text" size="1" maxlength="1" value="' 
				//+ item.solution[j] 
				+ '">'
		}
	}
}

