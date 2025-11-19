document.addEventListener('DOMContentLoaded', () => {
    loadBalance();
});

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

const SUITS = ["♠", "♣", "♥", "♦"]
const VALUES = [
    "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"
]
let balance = 1000;

class Deck {
    constructor (cards = freshDeck()){
        this.cards = cards;
    }

    get numberOfCards (){
        return this.cards.length;
    }

    pop() {
        return this.cards.shift()
    }

    shuffle (){
        for (let i = this.numberOfCards -1; i>0;i--){
            const newIndex = Math.floor(Math.random() * (i+1));
            const tmp = this.cards[newIndex];
            this.cards[newIndex] = this.cards[i];
            this.cards[i] = tmp;
        }
    }
}

class Card {
    constructor (suit, value){
        this.suit = suit;
        this.value = value;
    }

    get color(){
        return this.suit === '♣' || this.suit === '♠' ? 'black' : 'red';
    }

    getHTML (){
        const cardDiv = document.createElement('div');
        cardDiv.innerText = this.suit;
        cardDiv.classList.add('card', this.color);
        cardDiv.dataset.value = `${this.value} ${this.suit}`;
        cardDiv.id = 'cartaDinamica';
        
        return cardDiv;
    }
}

function freshDeck (){
    return SUITS.flatMap(suit => {
        return VALUES.map(value => {
            return new Card (suit, value);
        })
    })
}

const computerCardSlot = document.querySelector('.computer-card-slot');
const cantidadHiLo = document.getElementById('cantidadHiLo');

const deck = new Deck ();
deck.shuffle();

if (deck.cards[0].value === 'K' || deck.cards[0].value == 'A'){
    deck.pop();
}
computerCardSlot.appendChild(deck.cards[0].getHTML());

const tagGanador = document.getElementById('tagBalance');
const btnMayor = document.getElementById('btnMayor');

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

btnMayor.addEventListener('click', function () {
    if(cantidadHiLo.value === '') {
        Swal.fire({
            icon: "error",
            title: "Salio algo mal",
            text: "Ingresa una cantidad!",
        });
    } else {
        let cantidadValue = (cantidadHiLo.value === '') ? 0 : parseFloat(cantidadHiLo.value);
        let balanceValue = parseFloat(document.querySelector('#tagBalance').innerHTML);

        if (balanceValue < cantidadValue){
            Swal.fire({
                icon: "error",
                title: "Salio algo mal",
                text: "Fondos insuficientes!",
            });
            cantidadHiLo.value = '';
            return;
        }
        if (cantidadValue <= 0 ){
            Swal.fire({
                icon: "error",
                title: "Salio algo mal",
                text: "Cantidad invalida!",
            });
            cantidadHiLo.value = '';
            return;
        }
        
        if(deck.cards.length === 1){
            Swal.fire({
                icon: "error",
                title: "Salio algo mal",
                text: "Se han acabado las cartas!",
            });
            return;
        }

        playHiLoGame(cantidadValue, 'higher');
    }
});

const btnMenor = document.getElementById('btnMenor');
btnMenor.addEventListener('click', function () {
    if(cantidadHiLo.value === '') {
        Swal.fire({
            icon: "error",
            title: "Salio algo mal",
            text: "Ingresa una cantidad!",
        });
    } else {
        let cantidadValue = (cantidadHiLo.value === '') ? 0  : parseFloat(cantidadHiLo.value);
        let balanceValue = parseFloat(document.querySelector('#tagBalance').innerHTML);

        if (balanceValue < cantidadValue){
            Swal.fire({
                icon: "error",
                title: "Salio algo mal",
                text: "Fondos insuficientes!",
            });
            cantidadHiLo.value = '';
            return;
        }
        if (cantidadValue <= 0){
            Swal.fire({
                icon: "error",
                title: "Salio algo mal",
                text: "Cantidad invalida!",
            });
            cantidadHiLo.value = '';
            return;
        }
        
        if(deck.cards.length === 1){
            Swal.fire({
                icon: "error",
                title: "Salio algo mal",
                text: "Se han acabado las cartas!",
            });
            return;
        }

        playHiLoGame(cantidadValue, 'lower');
    }
});

async function playHiLoGame(betAmount, prediction) {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PLAY_HILO), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: userId,
                betAmount: betAmount,
                prediction: prediction
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error en el juego');
        }

        const result = await response.json();

        const oldCardElement = convertValueToCard(result.oldCard);
        const newCardElement = convertValueToCard(result.newCard);
        
        computerCardSlot.removeChild(document.getElementById('cartaDinamica'));
        computerCardSlot.appendChild(newCardElement);

        tagGanador.innerHTML = parseFloat(result.newBalance).toFixed(2);

        if (result.won) {
            showHasWon();
        } else {
            showHasLost();
        }

        cantidadHiLo.value = '';

        if (deck.cards.length > 1) {
            deck.pop();
        }

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message
        });
    }
}

function convertValueToCard(value) {
    const suits = ["♠", "♣", "♥", "♦"];
    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
    
    let displayValue;
    switch(value) {
        case 1: displayValue = 'A'; break;
        case 11: displayValue = 'J'; break;
        case 12: displayValue = 'Q'; break;
        case 13: displayValue = 'K'; break;
        default: displayValue = value.toString();
    }

    const cardDiv = document.createElement('div');
    cardDiv.innerText = randomSuit;
    cardDiv.classList.add('card', randomSuit === '♣' || randomSuit === '♠' ? 'black' : 'red');
    cardDiv.dataset.value = `${displayValue} ${randomSuit}`;
    cardDiv.id = 'cartaDinamica';
    
    return cardDiv;
}
