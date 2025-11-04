// src\scripts\mine.js
const xhr = new XMLHttpRequest();
const btnPlay = document.getElementById('btnPlay')
let balance = 0;
function showHasWon() {
    document.getElementById('hasWon').style.display = 'flex';
    cantidadMine.value = '';
    setTimeout(function () {
        document.getElementById('hasWon').style.display = 'none';
    }, 2000);
}


function showHasLost() {
    document.getElementById('hasLost').style.display = 'flex';
    cantidadMine.value = '';
    setTimeout(function () {
        document.getElementById('hasLost').style.display = 'none';
    }, 2000);
}

document.addEventListener('DOMContentLoaded', () => {

    loadBalance();
    loadName()
});

// ---------------------------------------------------------------------------------

const STATUS = {
    HIDDEN: 'hidden',
    MINE: 'mine',
    NUMBER: 'number',
    MARKED: 'marked',
}
const boardElement = document.querySelector('.board')
const boardSize = 5;
const NumberMines = 5;
const board = createTabla(boardSize,NumberMines)
let minesLCount = document.querySelector('[data-mine-count]');


function loadBalance() {

    var id = sessionStorage.getItem('token');
    var url = `/profile/balance?id=${id}`;

    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
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

    if(cantidadMine.value === '')
    {
        Swal.fire({
            icon: "error",
            title: "Salio algo mal",
            text: "Ingresa una cantidad!",
        });
    }
    else if(cantidadMine.value <= 0)
    {
        Swal.fire({
            icon: "error",
            title: "Salio algo mal",
            text: "Ingresa una cantidad valida!",
        });
    }
    else
    {

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



function listMinesLeft()
{
    const markedTilesLeftCount = board.reduce((count,row) =>{
        return count + row.filter(tile => tile.status === STATUS.MARKED).length;
    }, 0)

    minesLCount.textContent = NumberMines - markedTilesLeftCount;
}

function markTiles(tile)
{

    if(tile.status !== STATUS.HIDDEN && tile.status !== STATUS.MARKED)
    {
        return;
    }

     if(tile.status === STATUS.MARKED)
    {
        tile.status = STATUS.HIDDEN
    }
    else
    {
        tile.status = STATUS.MARKED
    }
}

function reveal(tile)
{
    if(tile.status !== STATUS.HIDDEN)
    {
        return;
    }

    if(tile.mine)
    {
        tile.status = STATUS.MINE;
        return;
    }

    tile.status = STATUS.NUMBER
}

function createTabla(boardSize,minesNumber)
{
    const tabla = [];
    const minesPos = getMinePos(boardSize,minesNumber);

    for(let x = 0 ; x < boardSize; x++)
    {
        const row = [];
        for(let y = 0 ; y < boardSize; y++)
        {
            const element = document.createElement('div');
            element.dataset.status = STATUS.HIDDEN;

            const tile = {
                element,
                x,
                y,
                mine:minesPos.some(samePosition.bind(null,{x,y})),
                get status()
                {
                    return element.dataset.status;
                },
                set status(val)
                {
                    this.element.dataset.status = val;
                }
            }
            row.push(tile)
        }
        tabla.push(row)
    }

    return tabla;
}



function checkGameEnd()
{

    const win = checkWin(board);
    const lose = checkLose(board);

    if(win || lose)
    {
        boardElement.addEventListener('click',stopProp,{capture:true})
        boardElement.addEventListener('contextmenu',stopProp,{capture:true})

    }

    if(win)
    {
        balance = balance.toFixed(2);
        storeActivity(balance, "Mines");
        updateBalance(parseFloat(balance));
        showHasWon();

    }
    if(lose)
    {
        balance = parseFloat(cantidadMine.value).toFixed(2);
        var negativeValue = balance * -1;
        board.forEach(row =>{
            row.forEach(tile =>{
                if(tile.status === STATUS.MARKED)
                {
                    markTiles(tile);
                }

                if(tile.mine)
                {
                    revealTile(board,tile)
                }

            })
        })
        storeActivity(negativeValue, "Mines");
        updateBalance(parseFloat(negativeValue));
        showHasLost();
    }
}

// ======================

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

function updateBalance(amount) {
    const id = sessionStorage.getItem('token');
    const url = '/profile/balance';

    let data = {
        id: id,
        amount: amount,
    };

    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.status !== 200)
        {
            alert(xhr.status + ': ' + xhr.statusText);
        }
        else
        {
            if (xhr.status === 200)
            {
                var data = JSON.parse(xhr.responseText);
                cantidadMine.innerHTML = 'hola';
                document.querySelector('#tagBalance').innerHTML = parseFloat(data.balance).toFixed(2);
            }
        }
    };
    xhr.send(JSON.stringify(data));
}

function storeActivity(balance, nameGame) {
    const id = sessionStorage.getItem('token');
    const url = '/profile/activity';

    var BetStatus = false;
    if (nameGame > 0) {
        BetStatus = true;
    }

    let data = {
        userID: id,
        balance: balance,
        dateGame: new Date().toISOString(),
        nameGame: nameGame,
        BetStatus: BetStatus
    };

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.status !== 200)
        {
            alert(xhr.status + ': ' + xhr.statusText);
        }
        else
        {
            if (xhr.status === 200)
            {
            }
        }
    };
    xhr.send(JSON.stringify(data));
}

// ======================

function checkWin(board)
{
    return board.every(row =>{
        return row.every(tile =>{
            return tile.status === STATUS.NUMBER || (tile.mine && (tile.status === STATUS.HIDDEN || tile.status === STATUS.MARKED))
        })
    })
}

function checkLose(board)
{
    return board.some(row =>{
        return row.some(tile =>{
            return tile.status === STATUS.MINE;
        })
    });
}

function stopProp(el)
{
    el.stopImmediatePropagation(); // para los eventos
}


function getMinePos(boardSize,minesNumber)
{
    const positions = [];

    while(positions.length < minesNumber)
    {
        const position = {
            x: randomNumer(boardSize),
            y: randomNumer(boardSize),
        }

        if(!positions.some(samePosition.bind(null,position))) // si alguno ya existe
        {
            positions.push(position);
        }
    }

    return positions;
}

function randomNumer(size)
{
    return Math.floor(Math.random() * size);
}
function samePosition(a,b)
{
    return a.x === b.x && a.y === b.y;
}

boardElement.style.setProperty('--size',boardSize)


/*
btnPlay.addEventListener('click', () =>{

    board.forEach(row =>{
        row.forEach(tile =>{
            boardElement.append(tile.element)
            // left click
            tile.element.addEventListener('click',() =>{
                reveal(tile);
                checkGameEnd();
            })
            //right click
            tile.element.addEventListener('contextmenu',ele =>{
                ele.preventDefault()
                markTiles(tile);
                listMinesLeft();
            })
        })
    })
    minesLCount.textContent = NumberMines;
})


 */