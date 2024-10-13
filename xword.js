'use strict'
window.onload = () => {
	makeGrid(jsObj.gridSize);
	jsObj.clueList.forEach(parseJson);
	jsObj.clueList.forEach(clueNumber);
	moveFocus();
}

function moveFocus() {
	/* Moves cursor to next cell after inserting letter */
	const inputs = document.querySelectorAll('.grid-item');
	inputs.forEach((item) => {
		item.addEventListener('input', () => {
			const id = Number(item.id.replace('grid-item-', ''));
			document.querySelector('#grid-item-' + (id + 1) + ' > input').focus();
		})
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

function clueNumber(item) {
	/* Fills in the clue numbers in first cell */
	const cell = item.y * jsObj.gridSize + item.x;
	if (document.querySelector('#grid-item-' + cell).querySelector('.clueNo') === null) {
		document.querySelector('#grid-item-' + cell).innerHTML += '<span class="clueNo">' 
			+ item.clueNo 
			+ '</span>';
	}
}

function selectWord(evt) {
	let id = evt.target.getAttribute('id').split('');
	const dir = id.pop();
	id = Number(id.join(''));
	jsObj.clueList.forEach((item) => {
		if (item.clueNo === id) {
			const cell = item.y * jsObj.gridSize + item.x;
			if (dir == 'a') {
				const wd = item.solution.length;
				for (let i = 0; i < wd; i++) {
					document.querySelector('#grid-item-' + (cell) + '> input').focus();
					document.querySelector('#grid-item-' + (cell + i)).style.border = '2px solid #666666';
				}
			} else {
				{
					const wd = item.solution.length;
					for (let i = 0; i < wd; i++) {
						document.querySelector('#grid-item-' + (cell) + '> input').focus();
						document.querySelector('#grid-item-' + (cell + i * jsObj.gridSize)).style.border = '2px solid #666666';
					}
				}
			}
		}
	})	
}

function parseJson (item) {
	/* Fills in grid with input elements and creates clue list */
	const clue = document.querySelector('#clues');
	clue.addEventListener('click', selectWord);
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

	const ansArr = item.solution.split('');

	for (let j = 0; j < ansArr.length; j++) {
		/* Iterates through solution putting input element in cell */
		if (item.dir === 'a') {
			document.querySelector('#grid-item-' 
				+ (item.y * jsObj.gridSize 
					+ item.x 
					+ j))
				.innerHTML = '<input type="text" size="1" maxlength="1" value="' 
			//+ ansArr[j] 
				+ '">'
		} else {
			document.querySelector('#grid-item-' 
				+ (item.y * jsObj.gridSize 
					+ item.x 
					+ (j * jsObj.gridSize)))
				.innerHTML = '<input type="text" size="1" maxlength="1" value="' 
			//+ ansArr[j] 
				+ '">'
		}
	}
}

