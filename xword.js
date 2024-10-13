'use strict'
window.onload = () => {
	const grid = makeGrid(jsObj.gridSize);
	jsObj.clueList.forEach(parseJson);
	jsObj.clueList.forEach(clueNumber);
	//	for (let i = 0; i < jsObj.clueList.length; i++) {
	//		parseJson(jsObj.clueList, i);
	//	}
}

function makeGrid(gridSize) {
	for (let i = 0; i < gridSize ** 2 ; i++) {
		document.querySelector('#container').innerHTML += 
			'<span class="grid-item" id="grid-item-' 
			+ i 
			+ '"></span>'
	}
}

function clueNumber(item) {
	const cell = item.y * jsObj.gridSize + item.x;
	document.querySelector('#grid-item-' + cell).innerHTML += '<span class="clueNo">' 
		+ item.clueNo 
		+ '</span>';
}

function parseJson (item) {
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
			if (item.dir === 'a') {
			document.querySelector('#grid-item-' 
				+ (item.y * jsObj.gridSize 
				+ item.x 
				+ j))
				.innerHTML = '<input type="text" size="1" maxlength="1" <!--value="' 
				+ ansArr[j] + '"-->>'
		} else {
			document.querySelector('#grid-item-' 
				+ (item.y * jsObj.gridSize 
				+ item.x 
				+ (j * jsObj.gridSize)))
				.innerHTML = '<input type="text" size="1" maxlength="1" <!--value="' + ansArr[j] + '"-->>'
		}
	}
}
