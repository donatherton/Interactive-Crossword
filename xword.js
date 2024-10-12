
window.onload = () => {
	const grid = makeGrid(jsObj.gridSize);
	//jsObj.clueList.forEach(parseJson);
	for (let i = 0; i < jsObj.clueList.length; i++) {
		parseJson(jsObj.clueList, i);
	}
}

function makeGrid(gridSize) {
	for (let i = 0; i < gridSize ** 2 ; i++) {
		document.querySelector('#container').innerHTML += 
			'<span>' + '<input  class="grid__item" id="grid_item-' 
			+ i 
			+ '" type="text" size="1" maxlength="1"></span>'
	}
}

function parseJson (item, i) {
	document.querySelector('#clues').innerHTML += 
		'<li>' 
		+ item[i].clueNo 
		+ '. ' 
		+ item[i].clue 
		+ ' (' 
		+ item[i].len 
		+ ')</li>';	
	const ansArr = item[i].solution.split('');
	for ( let j = 0; j < ansArr.length; j++) {
		
		if (item[i].dir === 'across') {
			document.querySelector('#grid_item-' 
				+ (item[i].y * jsObj.gridSize 
				+ item[i].x 
				+ j)).setAttribute('value', ansArr[j]);
		} else {
			document.querySelector('#grid_item-' 
				+ (item[i].y * jsObj.gridSize + item[i].x 
				+ (j * jsObj.gridSize))).setAttribute('value', ansArr[j]);
		}
	}
}
