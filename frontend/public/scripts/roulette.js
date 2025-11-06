import {Wheel} from 'https://cdn.jsdelivr.net/npm/spin-wheel@4.3.0/dist/spin-wheel-esm.js';
const xhr = new XMLHttpRequest();

const props = {
    items: [
      {label: '0', backgroundColor:'#008000',labelColor : '#fff', color : 'Verde'},
      {label: '32',backgroundColor : '#f00', labelColor : '#000', color : 'Rojo'  , paridad : 'par', docena : '3'},
      {label: '15', backgroundColor : '#000',labelColor : '#fff', color : 'Negro' , paridad:'impar', docena : '2'},
      {label: '19',backgroundColor : '#f00', labelColor : '#000', color : 'Rojo'  , paridad:'impar', docena : '2'},
      {label: '4', backgroundColor : '#000', labelColor : '#fff', color : 'Negro' , paridad : 'par', docena : '1'},
      {label: '21',backgroundColor : '#f00', labelColor : '#000', color : 'Rojo'  , paridad:'impar', docena : '2'},
      {label: '2', backgroundColor : '#000', labelColor : '#fff', color : 'Negro' , paridad : 'par', docena : '1'},
      {label: '25',backgroundColor : '#f00', labelColor : '#000', color : 'Rojo'  , paridad:'impar', docena : '3'},
      {label: '17', backgroundColor : '#000',labelColor : '#fff', color : 'Negro' , paridad:'impar', docena : '2'},
      {label: '34',backgroundColor : '#f00', labelColor : '#000', color : 'Rojo'  , paridad : 'par', docena : '3'},
      {label: '6', backgroundColor : '#000', labelColor : '#fff', color : 'Negro' , paridad : 'par', docena : '1'},
      {label: '27',backgroundColor : '#f00', labelColor : '#000', color : 'Rojo'  , paridad:'impar', docena : '3'},
      {label: '13', backgroundColor : '#000',labelColor : '#fff', color : 'Negro' , paridad:'impar', docena : '2'},
      {label: '36',backgroundColor : '#f00', labelColor : '#000', color : 'Rojo'  , paridad : 'par', docena : '3'},
      {label: '11', backgroundColor : '#000',labelColor : '#fff', color : 'Negro' , paridad:'impar', docena : '1'},
      {label: '30',backgroundColor : '#f00', labelColor : '#000', color : 'Rojo'  , paridad : 'par', docena : '3'},
      {label: '8', backgroundColor : '#000', labelColor : '#fff', color : 'Negro' , paridad : 'par', docena : '1'},
      {label: '23',backgroundColor : '#f00', labelColor : '#000', color : 'Rojo'  , paridad:'impar', docena : '2'},
      {label: '10', backgroundColor : '#000',labelColor : '#fff', color : 'Negro' , paridad : 'par', docena : '1'},
      {label: '5',backgroundColor : '#f00',  labelColor : '#000', color : 'Rojo'  , paridad:'impar', docena : '1'},
      {label: '24', backgroundColor : '#000',labelColor : '#fff', color : 'Negro' , paridad : 'par', docena : '2'},
      {label: '16',backgroundColor : '#f00', labelColor : '#000', color : 'Rojo'  , paridad : 'par', docena : '2'},
      {label: '33', backgroundColor : '#000',labelColor : '#fff', color : 'Negro' , paridad:'impar', docena : '3'},
      {label: '1', backgroundColor : '#f00', labelColor : '#000', color : 'Rojo'  , paridad:'impar', docena : '1'},
      {label: '20', backgroundColor : '#000',labelColor : '#fff', color : 'Negro' , paridad : 'par', docena : '2'},
      {label: '14',backgroundColor : '#f00', labelColor : '#000', color : 'Rojo'  , paridad : 'par', docena : '2'},
      {label: '31', backgroundColor : '#000',labelColor : '#fff', color : 'Negro' , paridad:'impar', docena : '3'},
      {label: '9',backgroundColor : '#f00',  labelColor : '#000', color : 'Rojo'  , paridad:'impar', docena : '1'},
      {label: '22', backgroundColor : '#000',labelColor : '#fff', color : 'Negro' , paridad : 'par', docena : '2'},
      {label: '18',backgroundColor : '#f00', labelColor : '#000', color : 'Rojo'  , paridad : 'par', docena : '2'},
      {label: '29', backgroundColor : '#000',labelColor : '#fff', color : 'Negro' , paridad:'impar', docena : '3'},
      {label: '7',backgroundColor : '#f00',  labelColor : '#000', color : 'Rojo'  , paridad:'impar', docena : '1'},
      {label: '28', backgroundColor : '#000',labelColor : '#fff', color : 'Negro' , paridad : 'par', docena : '3'},
      {label: '12',backgroundColor : '#f00', labelColor : '#000', color : 'Rojo'  , paridad : 'par', docena : '1'},
      {label: '35', backgroundColor : '#000',labelColor : '#fff', color : 'Negro' , paridad:'impar', docena : '3'},
      {label: '3',backgroundColor : '#f00',  labelColor : '#000', color : 'Rojo'  , paridad:'impar', docena : '1'},
      {label: '26', backgroundColor : '#000',labelColor : '#fff', color : 'Negro' , paridad : 'par', docena : '3'},
    ]
}

props.itemLabelFontSizeMax = 15;
const container = document.querySelector('.wheel-container');

let btnSpin = document.getElementById('btnSpin');
let checkboxRojo = document.getElementById('checkboxRojo');
let checkboxNegro = document.getElementById('checkboxNegro');
let checkboxVerde = document.getElementById('checkboxVerde');
let cantidadAColor = document.getElementById('cantidadAColor');
let checkboxPar = document.getElementById('checkboxPar');
let checkboxImpar = document.getElementById('checkboxImpar');
let cantidadAParidad = document.getElementById('cantidadAParidad');
let checkboxPrimera = document.getElementById('checkboxPrimera');
let checkboxSegunda = document.getElementById('checkboxSegunda');
let checkboxTercera = document.getElementById('checkboxTercera');
let cantidadADocena = document.getElementById('cantidadADocena');
const ColorDivCantidad = document.getElementById('ColorDivCantidad');
const ParImparDivCantidad = document.getElementById('ParImparDivCantidad');
const decDivCantidad = document.getElementById('decDivCantidad');

let tagBalance = document.getElementById('tagBalance');
let balance = 0;
let balanceActual = 0;

document.addEventListener('DOMContentLoaded', () => {
    loadBalanceRoulette();
});

function loadBalanceRoulette() {
    var id = sessionStorage.getItem('token');
    var url = getApiUrl(API_CONFIG.ENDPOINTS.BALANCE) + `?id=${id}`;

    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    
    xhr.onload = function() {
        if (xhr.status !== 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            if (xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                balanceActual = data.balance;
                tagBalance.innerHTML = parseFloat(data.balance).toFixed(2);
            }
        }
    };
    xhr.send();
}

function updateBalance(amount) {
    const id = sessionStorage.getItem('token');
    const url = getApiUrl(API_CONFIG.ENDPOINTS.BALANCE);

    let data = {
        id: id,
        amount: amount,
    };

    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    
    xhr.onload = function () {
        if (xhr.status !== 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            if (xhr.status === 200) {
                loadBalanceRoulette();
            }
        }
    };
    xhr.send(JSON.stringify(data));
}

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

const wheel = new Wheel(container, props);

function init() {
    wheel.borderWidth = 12;
    wheel.isInteractive = false;
    wheel.lineColor = '#D4AF37';
    wheel.radius = 0.9;

    ColorDivCantidad.style.display = "none";
    ParImparDivCantidad.style.display = "none";
    decDivCantidad.style.display = "none";
}

function actualizarVisibilidad() {
    if (checkboxRojo.checked || checkboxNegro.checked || checkboxVerde.checked) {
        ColorDivCantidad.style.display = "block";
    } else {
        ColorDivCantidad.style.display = "none";
    }
}

checkboxRojo.addEventListener('click', () => {
    if (checkboxRojo.checked) {
        checkboxNegro.checked = false;
        checkboxVerde.checked = false;
    }
    if (!checkboxRojo.checked) {
        cantidadAColor.value = "";
    }
    actualizarVisibilidad();
});

checkboxNegro.addEventListener('click', () => {
    if (checkboxNegro.checked) {
        checkboxRojo.checked = false;
        checkboxVerde.checked = false;
    }
    if (!checkboxNegro.checked) {
        cantidadAColor.value = "";
    }
    actualizarVisibilidad();
});

checkboxVerde.addEventListener('click', () => {
    if (checkboxVerde.checked) {
        checkboxRojo.checked = false;
        checkboxNegro.checked = false;
    }
    if (!checkboxVerde.checked) {
        cantidadAColor.value = "";
    }
    actualizarVisibilidad();
});

function actualizarVisibilidadParidad() {
    if (checkboxImpar.checked || checkboxPar.checked) {
        ParImparDivCantidad.style.display = "block";
    } else {
        cantidadAParidad.value = "";
        ParImparDivCantidad.style.display = "none";
    }
}

checkboxImpar.addEventListener('click', () => {
    if (checkboxImpar.checked) {
        checkboxPar.checked = false;
    }
    if (!checkboxImpar.checked && !checkboxPar.checked) {
        cantidadAParidad.value = "";
    }
    actualizarVisibilidadParidad();
});

checkboxPar.addEventListener('click', () => {
    if (checkboxPar.checked) {
        checkboxImpar.checked = false;
    }
    if (!checkboxPar.checked && !checkboxImpar.checked) {
        cantidadAParidad.value = "";
    }
    actualizarVisibilidadParidad();
});

function actualizarVisibilidadDecena() {
    if (checkboxPrimera.checked || checkboxSegunda.checked || checkboxTercera.checked) {
        decDivCantidad.style.display = "block";
    } else {
        cantidadADocena.value = "";
        decDivCantidad.style.display = "none";
    }
}

checkboxPrimera.addEventListener('click', () => {
    if (checkboxPrimera.checked) {
        checkboxSegunda.checked = false;
        checkboxTercera.checked = false;
    }
    if (!checkboxPrimera.checked && !checkboxSegunda.checked && !checkboxTercera.checked) {
        cantidadADocena.value = "";
    }
    actualizarVisibilidadDecena();
});

checkboxSegunda.addEventListener('click', () => {
    if (checkboxSegunda.checked) {
        checkboxPrimera.checked = false;
        checkboxTercera.checked = false;
    }
    if (!checkboxPrimera.checked && !checkboxSegunda.checked && !checkboxTercera.checked) {
        cantidadADocena.value = "";
    }
    actualizarVisibilidadDecena();
});

checkboxTercera.addEventListener('click', () => {
    if (checkboxTercera.checked) {
        checkboxPrimera.checked = false;
        checkboxSegunda.checked = false;
    }
    if (!checkboxPrimera.checked && !checkboxSegunda.checked && !checkboxTercera.checked) {
        cantidadADocena.value = "";
    }
    actualizarVisibilidadDecena();
});

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

    
    xhr.onload = function () {
        if (xhr.status !== 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        }
    };
    xhr.send(JSON.stringify(data));
}

btnSpin.addEventListener('click', function () {
    if((checkboxRojo.checked || checkboxNegro.checked || checkboxVerde.checked || checkboxPar.checked || checkboxImpar.checked || checkboxPrimera.checked || checkboxSegunda.checked || checkboxTercera.checked) && (cantidadAColor.value !== '' || cantidadAParidad.value !== '' || cantidadADocena.value !== '')) {
        
        let currentBalance = parseFloat(document.querySelector('#tagBalance').innerHTML);
        let valueAColor = cantidadAColor.value === '' ? 0 : parseFloat(cantidadAColor.value);
        let valueAParidad = cantidadAParidad.value === '' ? 0 : parseFloat(cantidadAParidad.value);
        let valueADocena = cantidadADocena.value === '' ? 0 : parseFloat(cantidadADocena.value);

        if (valueAColor < 0 || valueAParidad < 0 || valueADocena < 0) {
            Swal.fire({
                icon: "error",
                title: "No puedes apostar una cantidad negativa",
            });
            return;
        }
        else if ((valueAColor + valueAParidad + valueADocena) > currentBalance) {
            Swal.fire({
                icon: "error",
                title: "No puedes apostar más de balance",
            });
            return;
        }

        let numeroDecimalAleatorio = Math.random();
        let numeroAleatorio = Math.floor(numeroDecimalAleatorio * 37);

        wheel.spinToItem(numeroAleatorio, 6000, false, 2);
        btnSpin.disabled = true;

        setTimeout(() => {
            btnSpin.disabled = false;
            let indiceGanador = wheel.getCurrentIndex();
            let winnerColor = props.items[indiceGanador].color;
            let winnerParity = props.items[indiceGanador].paridad;
            let winnerDozen = props.items[indiceGanador].docena;

            let amountToAdd = 0;

            let checkedColors = [];
            let checkedParities = [];
            let checkedDozens = [];

            if (checkboxRojo.checked) checkedColors.push('Rojo');
            if (checkboxNegro.checked) checkedColors.push('Negro');
            if (checkboxVerde.checked) checkedColors.push('Verde');

            if (checkboxPar.checked) checkedParities.push('par');
            if (checkboxImpar.checked) checkedParities.push('impar');

            if (checkboxPrimera.checked) checkedDozens.push('1');
            if (checkboxSegunda.checked) checkedDozens.push('2');
            if (checkboxTercera.checked) checkedDozens.push('3');

            if ((checkedColors.length > 0 && cantidadAColor.value.length > 0) && checkedColors.includes(winnerColor)) {
                amountToAdd+= parseFloat(cantidadAColor.value);
                showHasWon();
            } else if (checkedColors.length > 0 && cantidadAColor.value.length > 0) {
                amountToAdd -= parseFloat(cantidadAColor.value);
                showHasLost();
            }

            if ((checkedParities.length && cantidadAParidad.value.length > 0) > 0 && checkedParities.includes(winnerParity)) {
                amountToAdd+= parseFloat(cantidadAParidad.value);
                showHasWon();
            } else if (checkedParities.length > 0 && cantidadAParidad.value.length > 0) {
                amountToAdd -= parseFloat(cantidadAParidad.value);
                showHasLost();
            }

            if ((checkedDozens.length > 0 && cantidadADocena.value.length > 0) && checkedDozens.includes(winnerDozen)) {
                amountToAdd+= parseFloat(cantidadADocena.value);
                showHasWon();
            } else if (checkedDozens.length > 0 && cantidadADocena.value.length > 0) {
                amountToAdd -= parseFloat(cantidadADocena.value);
                showHasLost();
            }

            cantidadAColor.value = '';
            cantidadAParidad.value = '';
            cantidadADocena.value = '';

            storeActivity(amountToAdd, 'Ruleta');
            updateBalance(amountToAdd);

            checkboxRojo.checked = false;
            checkboxNegro.checked = false;
            checkboxPar.checked = false;
            checkboxImpar.checked = false;
            checkboxPrimera.checked = false;
            checkboxSegunda.checked = false;
            checkboxTercera.checked = false;
            balance = 0;

        }, 6500);

        init();

    } else {
        Swal.fire({
            icon: "error",
            title: "Salio algo mal",
            text: "Ingresa una cantidad y seleccion!",
        })
    }
});

init();
