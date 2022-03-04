var boardStatus, players, activePlayer, activePiece;
var columns, notify;
var gameStatus = 'playing';
var scores = [];
var resetGame;
var pNamesUI = [];

//constants
const maxPerCol = 6;
const dom = 0, width = 1, height = 2, piecesIn = 3;
const p0 = 0, p1 = 1;
var flag = true;

window.onload = function() {

	//Get the columns data in JS object
	columns = [];
	for(let i = 0; i < 7; i++) {
		let dom = document.getElementById('column-' + i)
		columns.push({
			DOM_Object: dom,
			id: 		'column-' + i,
			count: 		0,
			ind: 		i
		});
		columns[i]['DOM_Object'].addEventListener('click', function() {
			if(gameStatus === 'playing') addPiece(columns[i]);
		});
		columns[i]['DOM_Object'].addEventListener('mouseover', function() {
			selectColumn(columns[i]);
		});;
	}

	//Active piece is the one that is shown for selection of columns
	activePiece = document.querySelector('.activePiece');
	scores[p0] = document.getElementById('p0-score');
	scores[p1] = document.getElementById('p1-score');
	resetGame = document.getElementById('new-game')
	pNamesUI[0] = document.getElementById('p0-name');
	pNamesUI[1] = document.getElementById('p1-name');
	notify = document.getElementById('notify');



	//Change piece size based on column widths
	window.addEventListener('resize', function() {
		activePiece.style.width = columns[1]['DOM_Object'].offsetWidth + 'px';
		activePiece.style.height = columns[1]['DOM_Object'].offsetWidth + 'px';
		// console.log((columns[1]['DOM_Object'].offsetHeight / 6) + 'px');
	});

	//Add active piece styles and sizes
	activePiece.classList.add('player-'+activePlayer);
	activePiece.style.width = columns[1]['DOM_Object'].offsetWidth + 'px';
	activePiece.style.height = columns[1]['DOM_Object'].offsetWidth + 'px';

	//Two player objects in a new array
	players = [];
		for(let i = 0; i < 2; i++) {
			players.push({
				name: 'Player ' + (i+1),
				score: 0,
				pieces: 0
			});
	}

	resetGame.addEventListener('click', function() {
		playAgain();
		resetBoardData();

		if(gameStatus === 'won') {
			header.textContent = 'Connect 4';
			gameStatus = 'playing';
			this.textContent = 'Reset';
		}
		
	});

	pNamesUI[0].addEventListener('change', function() {
		updateName(pNamesUI[0].value, p0);
	});

	pNamesUI[1].addEventListener('change', function() {
		updateName(pNamesUI[1].value, p1);
	});
	
	

	
	resetBoardData();
	playAgain();
}

function selectColumn(col) {
	// console.log('Hovering over a column.. ');
	activePiece.classList.remove('displayNone');
	activePiece.style.margin = '0 0 0 ' + col['DOM_Object'].offsetLeft + 'px';
}

// ADDING A PIECE TO THE GIVEN COLUMN.
function addPiece(col) {

	var win = false;

	if(col['count'] < 6) {
		boardStatus[5 - col['count']][col['ind']] = activePlayer;
		addPieceToUI(5 - col['count'], col['ind']);
		col['count']++;
		if(checkForWin()) {
			// console.log('PLAYER '+ activePlayer + ' WINS');
			gameStatus = 'won';
			notify.textContent = players[activePlayer].name + ' WON!'
			players[activePlayer].score++;
			updateScoresOnUI();
			resetGame.textContent = 'Play Again'
		} else {
			nextPlayer();
		}
	} 
	else {
		// console.log('Column FULL.')
	}
}


function updateScoresOnUI() {
	scores[p0].textContent = players[p0].score;
	scores[p1].textContent = players[p1].score;
	// console.log(scores);
	// console.log(players);
}

function addPieceToUI(row, col) {

	var piece = document.createElement('div');
	piece.classList.add('placedPiece', 'player-' + activePlayer);
	piece.id = row + '-' + col;
	let width = columns[1]['DOM_Object'].offsetWidth;
	piece.style.margin = (width * columns[col]['count'] + width) + '0 0 0';

	columns[col]['DOM_Object'].appendChild(piece);

}

//Plays again with the same players, 
//keeping the scores intact.
function playAgain() {

	//first player is the new active player
	activePlayer = p0;
	notify.textContent = '';


	//reset the count of pieces in each column. 
	//reset the UI inside each column
	for(let i = 0; i < 7; i++) {
		columns[i]['count'] = 0;
		columns[i]['DOM_Object'].innerHTML = '';
	}
}

function resetPlayers() {
	for(let i = 0; i < 2; i++) {
		players[i].score = 0;
		players[i].pieces = 0;
	}
}

//Change the name of players
function updateName(n, p) {
	players[p]['name'] = n;
	console.log(n + ' '+p);
}

//Chooses the next player after each turn
function nextPlayer() {

	let next = (activePlayer === p0) ? p1 : p0;

	activePiece.classList.remove('player-' + activePlayer);
	activePlayer = next;
	activePiece.classList.add('player-' + next);

	activePlayer = next;
}

function resetBoardData() {
	//Data for columns - 
	// false = nothing in there
	// 0 = red
	// 1 = black
	boardStatus = [];
	for(let i = 0; i < 6; i++) {
		boardStatus.push([false,false,false,false,false,false,false]);
	}
}

function checkForWin() {
	// console.log(boardStatus);

	//horizontal check
	for(let i = 0; i < (boardStatus.length); i++) {
		for(let j = 0; j < boardStatus[i].length - 3; j++) {				
			if(boardStatus[i][j] === activePlayer && boardStatus[i][j+1] === activePlayer && boardStatus[i][j+2] === activePlayer && boardStatus[i][j+3] === activePlayer) {
				return true;
			}
		}
	}
	
	//vertical check
	for(let i = 0; i < boardStatus.length - 3; i++) {
		for(let j = 0; j < boardStatus[i].length; j++) {
			if(boardStatus[i][j] === activePlayer && boardStatus[i+1][j] === activePlayer && boardStatus[i+2][j] === activePlayer && boardStatus[i+3][j] === activePlayer) {
				return true;
			}

		}
	}

	//diagonal check
	for (let i = 0; i < boardStatus.length-3; i++) {
		for (let j = 0; j < boardStatus[i].length-3; j++) {
			if(boardStatus[i][j] === activePlayer && boardStatus[i+1][j+1] === activePlayer && boardStatus[i+2][j+2] === activePlayer && boardStatus[i+3][j+3] === activePlayer) {
				return true;
			}
		}
	}

	//IF NOTHING WORKS, return false.
	return false;
}

function inArray(needle,haystack) {
	var count=haystack.length;
	for(var i=0;i<count;i++) {
		if(haystack[i]===needle){return true;}
	}
	return false;
}