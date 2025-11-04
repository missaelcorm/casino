// src\scripts\roulette.js
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
// props.itemBackgroundColors = ['#f00'];
// let elemento = props.items[1];
// elemento.backgroundColor = ['#f00'];
// 2. Decide where you want it to go:
const container = document.querySelector('.wheel-container');
const dropdownWinningItem = document.querySelector('select.winning-item');

// Creacion y atributos de wheel


//ELEMENTOS
let btnSpin = document.getElementById('btnSpin');
//let numeroGanador = document.getElementById('numeroGanador');
let colorGanador = document.getElementById('colorGanador');
let parOImpar = document.getElementById('parOImpar');
let docenaGanadora = document.getElementById('docenaGanadora');
let numeroElegido = document.getElementById('numeroElegido');

let cantidadANumero = document.getElementById('cantidadANumero');
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
const hasWon = document.getElementById('hasWon');
const hasLost = document.getElementById('hasLost');


let tagBalance = document.getElementById('tagBalance');

let balance = 0;
let balanceActual = 0;

document.addEventListener('DOMContentLoaded', () => {
    loadBalanceRoulette();
});


function loadBalanceRoulette()
{
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
          balanceActual = data.balance;
          tagBalance.innerHTML = parseFloat(data.balance).toFixed(2);
        }
      }
    };
    xhr.send();
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



//tagBalance.textContent = 'Balance: ' + balance;
const wheel = new Wheel(container, props);

function init()
{

    wheel.borderWidth = 12;
    wheel.isInteractive = false;
    wheel.lineColor = '#D4AF37';


    wheel.radius = 0.9;

    ColorDivCantidad.style.display = "none";
    ParImparDivCantidad.style.display = "none";
    decDivCantidad.style.display = "none";
}


function actualizarVisibilidad()
{
  // Verifica si al menos uno de los checkboxes está marcado
    if (checkboxRojo.checked || checkboxNegro.checked || checkboxVerde.checked)
    {
      ColorDivCantidad.style.display = "block";
    }
    else
    {
      ColorDivCantidad.style.display = "none";
    }
}

// Agrega eventos a los checkboxes
checkboxRojo.addEventListener('click', () =>
{
    if (!checkboxRojo.checked)
    {
      cantidadAColor.value = "";
    }
    actualizarVisibilidad();
});

checkboxNegro.addEventListener('click', () =>
{
    if (!checkboxNegro.checked)
    {
      cantidadAColor.value = "";
    }
    actualizarVisibilidad();
});


checkboxVerde.addEventListener('click', () =>
{
    if (!checkboxVerde.checked)
    {
      cantidadAColor.value = "";
    }
    actualizarVisibilidad();
});


function actualizarVisibilidadParidad()
{
  // Verifica si al menos uno de los checkboxes está marcado
  if (checkboxImpar.checked || checkboxPar.checked)
  {
    ParImparDivCantidad.style.display = "block";
  }
  else
  {
    cantidadAParidad.value = "";
    ParImparDivCantidad.style.display = "none";
  }
}


// Agrega eventos a los checkboxes

checkboxImpar.addEventListener('click', () =>
{
  if (!checkboxImpar.checked && !checkboxPar.checked)
  {
    cantidadAParidad.value = "";
  }
  actualizarVisibilidadParidad();
});

checkboxPar.addEventListener('click', () =>
{
  if (!checkboxPar.checked && !checkboxImpar.checked)
  {
    cantidadAParidad.value = "";
  }
  actualizarVisibilidadParidad();
});


function actualizarVisibilidadDecena()
{
  // Verifica si al menos uno de los checkboxes está marcado
  if (checkboxPrimera.checked || checkboxSegunda.checked || checkboxTercera.checked)
  {
    decDivCantidad.style.display = "block";
  }
  else
  {
    cantidadADocena.value = "";
    decDivCantidad.style.display = "none";
  }
}

// Agrega eventos a los checkboxes
checkboxPrimera.addEventListener('click', () =>
{
  if (!checkboxPrimera.checked && !checkboxSegunda.checked && !checkboxTercera.checked)
  {
    cantidadADocena.value = "";
  }
  actualizarVisibilidadDecena();
});

checkboxSegunda.addEventListener('click', () =>
{
  if (!checkboxPrimera.checked && !checkboxSegunda.checked && !checkboxTercera.checked)
  {
    cantidadADocena.value = "";
  }
  actualizarVisibilidadDecena();
});

checkboxTercera.addEventListener('click', () =>
{
  if (!checkboxPrimera.checked && !checkboxSegunda.checked && !checkboxTercera.checked)
  {
    cantidadADocena.value = "";
  }
  actualizarVisibilidadDecena();
});


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
        console.log(xhr.responseText);
      }
    }
  };
  xhr.send(JSON.stringify(data));
}



btnSpin.addEventListener('click', function () {


    if((checkboxRojo.checked || checkboxNegro.checked || checkboxVerde.checked || checkboxPar.checked || checkboxImpar.checked || checkboxPrimera.checked || checkboxSegunda.checked || checkboxTercera.checked) && (cantidadAColor.value !== '' || cantidadAParidad.value !== '' || cantidadADocena.value !== ''))
    {

        // Revisar por las condiciones que sean inválidas para salir de la función y mostrar la alerta
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
        //console.log("Numero ganador: " + props.items[numeroAleatorio].label);



        // if ((checkboxRojo.checked === true || checkboxNegro.checked === true || checkboxVerde.checked === true))
        // {
        //     console.log('1')
        //     balance += cantidadAColor.value;
        //     //balance -= cantidadAColor.value;
        //     tagBalance.textContent -= balance;
        // }

        // if ((checkboxPar.checked === true || checkboxImpar.checked === true))
        // {
        //   console.log('2')
        //   balance += cantidadAParidad.value;
        //   tagBalance.textContent -= balance;
        // }

        // if ((checkboxPrimera.checked === true || checkboxSegunda.checked === true || checkboxTercera.checked === true))
        // {
        //   console.log('3')
        //   balance += cantidadADocena.value;
        //   tagBalance.textContent -= balance;
        // }


        //tagBalance.innerHTML =  (balanceActual - balance);

        wheel.spinToItem(numeroAleatorio, 6000, false, 2);
        //document.querySelector('#btnSpin').style.display = 'none';
        btnSpin.disabled = true;


        setTimeout(() => {

            //document.querySelector('#btnSpin').style.display = 'block';
            btnSpin.disabled = false;
            let indiceGanador = wheel.getCurrentIndex();
            let winnerLabel = props.items[indiceGanador].label;
            let winnerColor = props.items[indiceGanador].color;
            let winnerParity = props.items[indiceGanador].paridad;
            let winnerDozen = props.items[indiceGanador].docena;

            // Amount to Add pueden ser valores negativos o positivos
            let amountToAdd = 0;

            console.log('Color ganador: ' + winnerColor);
            // ---------- Lógica 2 -------------
            console.log("Variable ganadora: " + winnerColor + " " + winnerParity + " " + winnerDozen);

            let checkedColors = [];
            let checkedParities = [];
            let checkedDozens = [];

            // Obtener las casillas de color marcadas
            if (checkboxRojo.checked) checkedColors.push('Rojo');
            if (checkboxNegro.checked) checkedColors.push('Negro');
            if (checkboxVerde.checked) checkedColors.push('Verde');

            // Obtener las casillas de paridad marcadas
            if (checkboxPar.checked) checkedParities.push('par');
            if (checkboxImpar.checked) checkedParities.push('impar');

            // Obtener las casillas de docenas marcadas
            if (checkboxPrimera.checked) checkedDozens.push('1');
            if (checkboxSegunda.checked) checkedDozens.push('2');
            if (checkboxTercera.checked) checkedDozens.push('3');

            console.log(checkedColors.length);
            console.log(checkedParities.length);
            console.log(checkedDozens.length);

            // ----------- Condiciones que compara propiedad ganadora con arreglos checked ---------
            
            // Comprobación de color
            // 1. Comprobar que se haya escrito como checked y el input no esté vacío
            // 2. El resultado de color está en checkedColors?
            // 3. Si es así, entonces sumar la cantidad
            // 4. De lo contrario, restarlo
            if ((checkedColors.length > 0 && cantidadAColor.value.length > 0) && checkedColors.includes(winnerColor)) {
              amountToAdd+= parseFloat(cantidadAColor.value);
                showHasWon();
            } else if (checkedColors.length > 0 && cantidadAColor.value.length > 0) {
              amountToAdd -= parseFloat(cantidadAColor.value);
              showHasLost();
            }

            // Lo mismo para par e impar
            if ((checkedParities.length && cantidadAParidad.value.length > 0) > 0 && checkedParities.includes(winnerParity)) {
              amountToAdd+= parseFloat(cantidadAParidad.value);
              showHasWon();
            } else if (checkedParities.length > 0 && cantidadAParidad.value.length > 0) {

              amountToAdd -= parseFloat(cantidadAParidad.value);
                showHasLost();
            }

            // Docenas
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



            //----------- Lógica 1 ----------
            // if(winnerColor === 'Rojo' && checkboxRojo.checked === true)
            // {
            //   console.log("Here1");
            //   console.log(parseFloat(cantidadAColor.value))
            //   balanceActual += parseFloat(cantidadAColor.value);

            //     //updateBalance(balanceActual);
            //     amountToAdd += parseFloat(cantidadAColor.value); 
            // }
            // else if(winnerColor === 'Negro' && checkboxNegro.checked === true)
            // {
            //   console.log("Here2");
            //   balanceActual = parseFloat(cantidadAColor.value);
            //     // updateBalance(balanceActual);
            //     amountToAdd += parseFloat(cantidadAColor.value); 
            // }
            // else if(winnerColor === 'Verde' && checkboxVerde.checked === true)
            // {
            //   console.log("Here3");
            //   balanceActual = parseFloat(cantidadAColor.value);
            //   // updateBalance(balanceActual);
            //     amountToAdd += parseFloat(cantidadAColor.value); 
            // }
            // else if(winnerParity === 'par' && checkboxPar.checked === true)
            // {
            //   console.log("Here4");
            //   balanceActual = parseFloat(cantidadAParidad.value);
            //     // updateBalance(balanceActual);

            //     amountToAdd += parseFloat(cantidadAColor.value); 
            // }
            // else if(winnerParity === 'impar' && checkboxImpar.checked === true)
            // {
            //   console.log("Here5");
            //   balanceActual = parseFloat(cantidadAParidad.value);
            //     // updateBalance(balanceActual);
            //     amountToAdd += parseFloat(cantidadAColor.value); 
            // }
            // else if(winnerDozen === '1' && checkboxPrimera.checked === true)
            // {
            //   console.log("Here6");
            //   balanceActual = parseFloat(cantidadADocena.value) * 2;
            //     // updateBalance(balanceActual);
            //     amountToAdd += parseFloat(cantidadAColor.value); 
            // }
            // else if(winnerDozen === '2' && checkboxSegunda.checked === true)
            // {
            //   console.log("Here7");
            //   balanceActual = parseFloat(cantidadADocena.value) * 2;
            //     // updateBalance(balanceActual);
            //     amountToAdd += parseFloat(cantidadAColor.value); 
            // }
            // else if(winnerDozen === '3' && checkboxTercera.checked === true)
            // {
            //   console.log("Here8");
            //   balanceActual = parseFloat(cantidadADocena.value) * 2;
            //     // updateBalance(balanceActual);
            //     amountToAdd += parseFloat(cantidadAColor.value); 
            // }
            // else
            // {
            //     const diff = balance * -1;
            //     // updateBalance(diff);

            //     // var cantidadApostadaColor = (cantidadAColor.value === '') ? 0: parseFloat(cantidadAColor.value);
            //     // var cantidadApostadaDocena = (cantidadADocena.value === '') ? 0: parseFloat(cantidadADocena.value);
            //     // var cantidadApostadaParidad = (cantidadAParidad.value === '') ? 0: parseFloat(cantidadAParidad.value);

            //     // console.log("----");
            //     // console.log(cantidadApostadaColor);
            //     // console.log(cantidadApostadaParidad);
            //     // console.log(cantidadApostadaDocena);
                
            // }

            console.log("Valor de variable amountToAdd: " + amountToAdd);



            //Resets checkboxes
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

    }
    else
    {
        Swal.fire({
            icon: "error",
            title: "Salio algo mal",
            text: "Ingresa una cantidad y seleccion!",
        })
    }
});


init();


//Checar valores
// let valorNumeroElegido = numeroElegido.value;
// console.log("Valor numero elegido: " + valorNumeroElegido);
// let indiceValorElegido = props.items.findIndex(item => item.label === valorNumeroElegido);
// console.log("Indice del numero elegido: " + indiceValorElegido);

// console.log("Checkbox rojo status: " + checkboxRojo.checked);
// console.log('Jalando');

/*
//RESETS
//numeroGanador.textContent = 'Numero ganador: ';
colorGanador.textContent = 'Color ganador: ';
parOImpar.textContent = 'Par o Impar: ';
docenaGanadora.textContent = 'Docena ganadora: ';

 */

//Restar lo apostado
// if (cantidadANumero != '' && numeroElegido.value  != ''){
//   balance = balance - cantidadANumero.value;
//   tagBalance.textContent = 'Balance: ' + balance;
// };

//CONDICIONALES Y CONTROL DE RANGOS
//Si no eligio ningun numero en especifico lo hace de manera aleatorio, si no lo manda a un numero despues del que eligio
//numeroAleatorio o indiceValorElegido+1
// if(indiceValorElegido == -1){
//   indiceValorElegido = numeroAleatorio;
// }
// indiceValorElegido = numeroAleatorio;
// if (valorNumeroElegido > 36){

//   return alert("Numero fuera de rango");
// }

// console.log('Valor numero elegido: ' + numeroElegido.value);

/*
//Reiniciar las etiquetas y las opciones
// numeroGanador.textContent = 'Numero ganador: ' + winnerLabel;
colorGanador.textContent = 'Color Ganador: ' + winnerColor;
parOImpar.textContent = 'Par o Impar: ' + winnerParity;
docenaGanadora.textContent = 'Docena ganadora: ' + winnerDozen;
// numeroElegido.value = '';

 */

/*
//Resets cantidades
// cantidadANumero.value = '';
cantidadAColor.value = '';
cantidadAParidad.value = '';
cantidadADocena.value = '';

 */
