const xhr = new XMLHttpRequest();

document.addEventListener('DOMContentLoaded', () => {
    loadBalance();
});

function loadBalance() {
    var id = sessionStorage.getItem('token');
    var url = getApiUrl(API_CONFIG.ENDPOINTS.BALANCE) + `?id=${id}`;

    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.withCredentials = true;
    
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
console.log(deck.cards);

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
        let balanceValue = document.querySelector('#tagBalance').innerHTML;

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
        balance = balance-cantidadHiLo.value;
        if(deck.cards.length === 1){
            Swal.fire({
                icon: "error",
                title: "Salio algo mal",
                text: "Se han acabado las cartas!",
            });
            return;
        }
        let cartaVieja = deck.pop().value;
        while (deck.cards[0].value === 'K' || deck.cards[0].value == 'A'){
            deck.pop();
        }
        let cartaNueva = deck.cards[0].value;
        if (cartaVieja == 'J' || cartaVieja == 'Q' || cartaVieja == 'K' || cartaVieja == 'A'){
            switch (cartaVieja){
                case 'J':
                    cartaVieja = 11;
                    break;
                case 'Q':
                    cartaVieja = 12;
                    break;
                case 'K':
                    cartaVieja = 13;
                    break;
                case 'A':
                    cartaVieja = 1;
                    break
            }
        }
        if (cartaNueva == 'J' || cartaNueva == 'Q' || cartaNueva == 'K' || cartaNueva == 'A'){
            switch (cartaNueva){
                case 'J':
                    cartaNueva = 11;
                    break;
                case 'Q':
                    cartaNueva = 12;
                    break;
                case 'K':
                    cartaNueva = 13;
                    break;
                case 'A':
                    cartaNueva = 1;
                    break
            }
        }
        if(cartaNueva>=cartaVieja){
            let posibilidadesArriba = (cartaVieja/13)+1;
            let ganancia = cantidadValue * posibilidadesArriba;
            
            console.log('🎉 Ganaste en Hi-Lo:');
            console.log('   Cantidad apostada:', cantidadValue);
            console.log('   Ganancia:', ganancia);
            
            storeActivity(ganancia, "Hi-Lo");
            updateBalance(ganancia);
            showHasWon();
        }else{
            let perdida = -cantidadValue;
            
            console.log('💔 Perdiste en Hi-Lo:');
            console.log('   Cantidad apostada:', cantidadValue);
            console.log('   Pérdida:', perdida);
            
            storeActivity(perdida, "Hi-Lo");
            updateBalance(perdida);
            showHasLost();
        }
        computerCardSlot.removeChild(cartaDinamica);
        computerCardSlot.appendChild(deck.cards[0].getHTML());
        cantidadHiLo.value = '';
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
        let balanceValue = document.querySelector('#tagBalance').innerHTML;

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
        balance = balance-cantidadHiLo.value;
        if(deck.cards.length === 1){
            Swal.fire({
                icon: "error",
                title: "Salio algo mal",
                text: "Se han acabado las cartas!",
            });
            return;
        }
        let cartaVieja = deck.pop().value;
        while (deck.cards[0].value === 'K' || deck.cards[0].value == 'A'){
            deck.pop();
        }
        let cartaNueva = deck.cards[0].value;
        if (cartaVieja == 'J' || cartaVieja == 'Q' || cartaVieja == 'K' || cartaVieja == 'A'){
            switch (cartaVieja){
                case 'J':
                    cartaVieja = 11;
                    break;
                case 'Q':
                    cartaVieja = 12;
                    break;
                case 'K':
                    cartaVieja = 13;
                    break;
                case 'A':
                    cartaVieja = 1;
                    break
            }
        }
        if (cartaNueva == 'J' || cartaNueva == 'Q' || cartaNueva == 'K' || cartaNueva == 'A'){
            switch (cartaNueva){
                case 'J':
                    cartaNueva = 11;
                    break;
                case 'Q':
                    cartaNueva = 12;
                    break;
                case 'K':
                    cartaNueva = 13;
                    break;
                case 'A':
                    cartaNueva = 1;
                    break
            }
        }
        if(cartaNueva<=cartaVieja){
            let posibilidadesAbajo = ((13-(cartaVieja-1))/13)+1;
            let ganancia = cantidadValue * posibilidadesAbajo; 
            
            console.log('🎉 Ganaste en Hi-Lo:');
            console.log('   Cantidad apostada:', cantidadValue);
            console.log('   Ganancia:', ganancia);
            
            storeActivity(ganancia, "Hi-Lo");
            updateBalance(ganancia);
            showHasWon();
        }else{
            let perdida = -cantidadValue;
            
            console.log('💔 Perdiste en Hi-Lo:');
            console.log('   Cantidad apostada:', cantidadValue);
            console.log('   Pérdida:', perdida);
            
            storeActivity(perdida, "Hi-Lo");
            updateBalance(perdida);
            showHasLost();
        }

        computerCardSlot.removeChild(cartaDinamica);
        computerCardSlot.appendChild(deck.cards[0].getHTML());
        cantidadHiLo.value = '';
    }
});

function updateBalance(amount) {
    const id = sessionStorage.getItem('token');
    const url = getApiUrl(API_CONFIG.ENDPOINTS.BALANCE);

    let data = {
        id: id,
        amount: amount,
    };

    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.withCredentials = true;
    
    xhr.onload = function () {
        if (xhr.status !== 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            if (xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                tagGanador.innerHTML = data.balance.toFixed(2);
            }
        }
    };
    xhr.send(JSON.stringify(data));
}

function storeActivity(balance, nameGame) {
    const id = sessionStorage.getItem('token');
    const url = getApiUrl(API_CONFIG.ENDPOINTS.ACTIVITY);

    var BetStatus = false;
    if (balance > 0) {
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
    xhr.withCredentials = true;
    
    xhr.onload = function () {
        if (xhr.status !== 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        }
    };
    xhr.send(JSON.stringify(data));
}