
window.onload = () => {
	const grid = makeGrid(jsObj.gridSize);
	jsObj.clueList.forEach(parseJson);
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
		if (j === 0) {
			clueNumber = item.clueNo;
		} else {
			clueNumber = '';
		}
		if (item.dir === 'a') {
			document.querySelector('#grid-item-' 
				+ (item.y * jsObj.gridSize 
				+ item.x 
				+ j)).innerHTML = '<span class="clueNo">' 
				+ clueNumber 
				+ '</span><input type="text" size="1" maxlength="1">'
		} else {
			document.querySelector('#grid-item-' 
				+ (item.y * jsObj.gridSize 
				+ item.x 
				+ (j * jsObj.gridSize))).innerHTML = '<span class="clueNo">' 
				+ clueNumber 
				+ '</span><input type="text" size="1" maxlength="1">'
		}
	}
}
