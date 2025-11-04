// src\scripts\balance.js
const xhr = new XMLHttpRequest();
let tat;


document.addEventListener('DOMContentLoaded', () => {
    loadBalance();
});

function showDepositForm() {
    document.querySelector('.balance-container-form').style.display = 'block';
    document.querySelector('.balance-container-form-withdraw').style.display = 'none';
}

function showWithdrawForm() {
    document.querySelector('.balance-container-form').style.display = 'none';
    document.querySelector('.balance-container-form-withdraw').style.display = 'block';
}


function loadBalance() {
    var id = sessionStorage.getItem('token');
    var url = `/profile/balance?id=${id}`;

    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText); 
        } else { 
            if (xhr.status === 200) {

                // Replace data from given status
                let data = JSON.parse(xhr.responseText);
                let balanceField = document.querySelector('#balanceField');
                tat = parseFloat(data.balance).toFixed(2);
                balanceField.innerHTML = tat;
            }
        }
    };
    xhr.send();
    document.getElementById('value-1').addEventListener('change', showDepositForm);
    document.getElementById('value-2').addEventListener('change', showWithdrawForm);
}

function addBalance() {
    var id = sessionStorage.getItem('token');
    var amount = document.querySelector('#balance-form-deposit').value;
    amount = parseFloat(amount);


    if (isNaN(amount) || amount <= 0) {
        Swal.fire({
            icon: "error",
            title: "Salio un error",
            text: "Ingrese un monto válido para retirar.",
        });
        return;
    }

    let data = {
        id: id,
        amount: amount
    }
    data = JSON.stringify(data);

    xhr.open('PUT', `/profile/balance`, false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            if (xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                let balanceField = document.querySelector('#balanceField');
                balanceField.innerHTML = data.balance.toFixed(2);

                document.querySelector('#balance-form-deposit').value = '';
            }
        }
    };
    xhr.send(data);
    Swal.fire({
        position: "center",
        icon: "success",
        title: "Se ha hecho el deposito.",
        showConfirmButton: false,
        timer: 1500
    });
    showDepositForm();
}


function withdrawBalance() {
    var id = sessionStorage.getItem('token');
    var amount = document.querySelector('#balance-form-withdraw').value;
    amount = parseFloat(amount);


    if(!(amount > tat))
    {

        if (isNaN(amount) || amount <= 0) {
            Swal.fire({
                icon: "error",
                title: "Salio un error",
                text: "Ingrese un monto válido para retirar.",
            });
            return;
        }

        amount = -amount;

        let data = {
            id: id,
            amount: amount
        }

        data = JSON.stringify(data);

        xhr.open('PUT', `/profile/balance`, false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            if (xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText);
            } else {
                if (xhr.status === 200) {
                    let data = JSON.parse(xhr.responseText);
                    let balanceField = document.querySelector('#balanceField');
                    balanceField.innerHTML = parseFloat(data.balance).toFixed(2);

                    document.querySelector('#balance-form-withdraw').value = '';
                }
            }
        };
        xhr.send(data);
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Se ha hecho el retiro.",
            showConfirmButton: false,
            timer: 1500
        });

        showDepositForm();
    }
    else
    {
        Swal.fire({
            icon: "error",
            title: "Salio un error",
            text: "No puedes retirar mas de lo que tienes.",
        });
        document.querySelector('#balance-form-withdraw').value = '';
    }


}

