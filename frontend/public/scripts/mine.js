const btnPlay = document.getElementById('btnPlay')
let balance = 0;
let cantidadApostada = 0;

function showHasWon() {
    document.getElementById('hasWon').style.display = 'flex';
    setTimeout(function () {
        document.getElementById('hasWon').style.display = 'none';
    }, 2000);
}

function showHasLost() {
    document.getElementById('hasLost').style.display = 'flex';
    setTimeout(function () {
        document.getElementById('hasLost').style.display = 'none';
    }, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
    loadBalance();
    loadName();
});

const STATUS = {
    HIDDEN: 'hidden',
    MINE: 'mine',
    NUMBER: 'number',
    MARKED: 'marked',
}

const boardElement = document.querySelector('.board')
const boardSize = 5;
const NumberMines = 5;
const board = createTabla(boardSize, NumberMines)
let minesLCount = document.querySelector('[data-mine-count]');

function loadBalance() {
    const xhr = new XMLHttpRequest();
    var id = localStorage.getItem('userId');
    var token = localStorage.getItem('token');
    var url = getApiUrl(API_CONFIG.ENDPOINTS.BALANCE) + `?id=${id}`;

    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    
    xhr.onload = function() {
        if (xhr.status !== 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            if (xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                let balanceTag = document.querySelector('#tagBalance');
                balanceTag.innerHTML = parseFloat(data.balance).toFixed(2);
            }
        }
    };
    xhr.send();
}

const cantidadMine = document.getElementById('cantidadMine');

btnPlay.addEventListener('click', () => {
    resetGame();

    if(cantidadMine.value === '') {
        Swal.fire({
            icon: "error",
            title: "Salio algo mal",
            text: "Ingresa una cantidad!",
        });
        return;
    } else if(cantidadMine.value <= 0) {
        Swal.fire({
            icon: "error",
            title: "Salio algo mal",
            text: "Ingresa una cantidad valida!",
        });
        return;
    } else {
        cantidadApostada = parseFloat(cantidadMine.value);
        cantidadMine.value = '';
        
        
        board.forEach((row) => {
            row.forEach((tile) => {
                boardElement.append(tile.element);
                tile.element.addEventListener('click', () => {
                    reveal(tile);
                    checkGameEnd();
                });
                tile.element.addEventListener('contextmenu', (ele) => {
                    ele.preventDefault();
                    markTiles(tile);
                    listMinesLeft();
                });
            });
        });
        minesLCount.textContent = NumberMines;
    }
});

function resetGame() {
    document.getElementById('hasWon').style.display = 'none';
    document.getElementById('hasLost').style.display = 'none';

    boardElement.removeEventListener('click', stopProp, { capture: true });
    boardElement.removeEventListener('contextmenu', stopProp, { capture: true });

    boardElement.innerHTML = '';
    board.forEach((row) => {
        row.forEach((tile) => {
            tile.status = STATUS.HIDDEN;
        });
    });
}

function listMinesLeft() {
    const markedTilesLeftCount = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === STATUS.MARKED).length;
    }, 0)

    minesLCount.textContent = NumberMines - markedTilesLeftCount;
}

function markTiles(tile) {
    if(tile.status !== STATUS.HIDDEN && tile.status !== STATUS.MARKED) {
        return;
    }

    if(tile.status === STATUS.MARKED) {
        tile.status = STATUS.HIDDEN
    } else {
        tile.status = STATUS.MARKED
    }
}

function reveal(tile) {
    if(tile.status !== STATUS.HIDDEN) {
        return;
    }

    if(tile.mine) {
        tile.status = STATUS.MINE;
        return;
    }

    tile.status = STATUS.NUMBER;
}

async function playMinesGame(won) {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PLAY_MINES), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: userId,
                betAmount: cantidadApostada,
                won: won
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error en el juego');
        }

        const result = await response.json();

        document.querySelector('#tagBalance').innerHTML = parseFloat(result.newBalance).toFixed(2);



    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message
        });
    }
}

function createTabla(boardSize, minesNumber) {
    const tabla = [];
    const minesPos = getMinePos(boardSize, minesNumber);

    for(let x = 0; x < boardSize; x++) {
        const row = [];
        for(let y = 0; y < boardSize; y++) {
            const element = document.createElement('div');
            element.dataset.status = STATUS.HIDDEN;

            const tile = {
                element,
                x,
                y,
                mine: minesPos.some(samePosition.bind(null, {x, y})),
                get status() {
                    return element.dataset.status;
                },
                set status(val) {
                    this.element.dataset.status = val;
                }
            }
            row.push(tile)
        }
        tabla.push(row)
    }

    return tabla;
}

function checkGameEnd() {
    const win = checkWin(board);
    const lose = checkLose(board);

    if(win || lose) {
        boardElement.addEventListener('click', stopProp, {capture: true})
        boardElement.addEventListener('contextmenu', stopProp, {capture: true})
    }

    if(win) {        
        playMinesGame(true);
        showHasWon();
    }
    
    if(lose) {
        
        board.forEach(row => {
            row.forEach(tile => {
                if(tile.status === STATUS.MARKED) {
                    markTiles(tile);
                }
                if(tile.mine) {
                    revealTile(board, tile)
                }
            })
        })
        
        playMinesGame(false);
        showHasLost();
    }
}

function revealTile(board, tile) {
    if (tile.status !== STATUS.HIDDEN) {
        return
    }

    if (tile.mine) {
        tile.status = STATUS.MINE
        return
    }

    tile.status = STATUS.NUMBER
    const adjacentTiles = nearbyTiles(board, tile)
    const mines = adjacentTiles.filter(t => t.mine)
    if (mines.length === 0) {
        adjacentTiles.forEach(revealTile.bind(null, board))
    } else {
        tile.element.textContent = mines.length
    }
}

function nearbyTiles(board, { x, y }) {
    const tiles = []

    for (let xOffset = -1; xOffset <= 1; xOffset++) {
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
            const tile = board[x + xOffset]?.[y + yOffset]
            if (tile) tiles.push(tile)
        }
    }

    return tiles
}

function checkWin(board) {
    return board.every(row => {
        return row.every(tile => {
            return tile.status === STATUS.NUMBER || (tile.mine && (tile.status === STATUS.HIDDEN || tile.status === STATUS.MARKED))
        })
    })
}

function checkLose(board) {
    return board.some(row => {
        return row.some(tile => {
            return tile.status === STATUS.MINE;
        })
    });
}

function stopProp(el) {
    el.stopImmediatePropagation();
}

function getMinePos(boardSize, minesNumber) {
    const positions = [];

    while(positions.length < minesNumber) {
        const position = {
            x: randomNumer(boardSize),
            y: randomNumer(boardSize),
        }

        if(!positions.some(samePosition.bind(null, position))) {
            positions.push(position);
        }
    }

    return positions;
}

function randomNumer(size) {
    return Math.floor(Math.random() * size);
}

function samePosition(a, b) {
    return a.x === b.x && a.y === b.y;
}

boardElement.style.setProperty('--size', boardSize)
