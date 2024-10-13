'use strict'
window.onload = () => {
	makeGrid(jsObj.gridSize);
	jsObj.clueList.forEach(parseJson);
	jsObj.clueList.forEach(clueNumber);
	//	for (let i = 0; i < jsObj.clueList.length; i++) {
	//		parseJson(jsObj.clueList, i);
	//	}
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

function parseJson (item) {
	/* Fills in grid with input elements and creates clue list */
	document.querySelector('#clues').innerHTML += 
		'<li>' 
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
