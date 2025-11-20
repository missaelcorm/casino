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
    const xhr = new XMLHttpRequest();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
        window.location.href = '/logIn';
        return;
    }
    
    var url = getApiUrl(API_CONFIG.ENDPOINTS.BALANCE) + `?id=${userId}`;

    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    
    xhr.onload = function() {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText); 
        } else { 
            if (xhr.status === 200) {
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
    const xhr = new XMLHttpRequest();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    var amount = document.querySelector('#balance-form-deposit').value;
    amount = parseFloat(amount);

    if (isNaN(amount) || amount <= 0) {
        Swal.fire({
            icon: "error",
            title: "Salió un error",
            text: "Ingrese un monto válido para depositar.",
        });
        return;
    }

    let data = {
        id: userId,
        amount: amount
    }
    data = JSON.stringify(data);

    xhr.open('PUT', getApiUrl(API_CONFIG.ENDPOINTS.BALANCE), false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    
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
        title: "Se ha hecho el depósito.",
        showConfirmButton: false,
        timer: 1500
    });
    showDepositForm();
}

function withdrawBalance() {
    const xhr = new XMLHttpRequest();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    var amount = document.querySelector('#balance-form-withdraw').value;
    amount = parseFloat(amount);

    if (isNaN(amount) || amount <= 0) {
        Swal.fire({
            icon: "error",
            title: "Salió un error",
            text: "Ingrese un monto válido para retirar.",
        });
        return;
    }

    if(amount > tat) {
        Swal.fire({
            icon: "error",
            title: "Salió un error",
            text: "No puedes retirar más de lo que tienes.",
        });
        document.querySelector('#balance-form-withdraw').value = '';
        return;
    }

    amount = -amount;

    let data = {
        id: userId,
        amount: amount
    }
    data = JSON.stringify(data);

    xhr.open('PUT', getApiUrl(API_CONFIG.ENDPOINTS.BALANCE), false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    
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