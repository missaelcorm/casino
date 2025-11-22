let tat;
const STRIPE_LAMBDA_URL = getStripeLambdaUrl();

document.addEventListener('DOMContentLoaded', async () => {
    await confirmStripeDepositIfNeeded();
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

async function addBalance() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    let amount = document.querySelector('#balance-form-deposit').value;
    amount = parseFloat(amount);

    if (!token || !userId) {
        // Si por alguna razón no hay sesión, lo sacamos al login
        window.location.href = '/logIn';
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        Swal.fire({
            icon: "error",
            title: "Salió un error",
            text: "Ingrese un monto válido para depositar.",
        });
        return;
    }

    try {
        const response = await fetch(STRIPE_LAMBDA_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount,
                userId
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Error Lambda Stripe:', data);
            Swal.fire({
                icon: "error",
                title: "Error al crear el pago",
                text: data.error || 'No se pudo iniciar el pago con Stripe.',
            });
            return;
        }

        if (!data.url) {
            console.error('Respuesta sin URL de Stripe:', data);
            Swal.fire({
                icon: "error",
                title: "Error al crear el pago",
                text: "No se recibió la URL de pago.",
            });
            return;
        }

        // Opcional: limpiar campo antes de salir
        document.querySelector('#balance-form-deposit').value = '';

        // Redirige a la UI de Stripe Checkout
        window.location.href = data.url;

    } catch (error) {
        console.error('Error llamando a la Lambda:', error);
        Swal.fire({
            icon: "error",
            title: "Error de conexión",
            text: "No se pudo conectar con el servicio de pagos.",
        });
    }
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

async function confirmStripeDepositIfNeeded() {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    if (!sessionId) return;  // no venimos de Stripe

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) return;

    try {
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.STRIPE_CONFIRM_DEPOSIT), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ sessionId })
        });

        const data = await response.json();

        if (response.ok) {
            // Actualiza el balance en pantalla si el backend lo regresa
            if (typeof data.balance !== 'undefined') {
                const balanceField = document.querySelector('#balanceField');
                balanceField.innerHTML = parseFloat(data.balance).toFixed(2);
            }

            Swal.fire({
                icon: "success",
                title: "Depósito confirmado",
                text: "Tu saldo ha sido actualizado.",
                timer: 1800,
                showConfirmButton: false
            });

            // Limpia el session_id de la URL
            window.history.replaceState({}, document.title, window.location.pathname);
        } else {
            Swal.fire({
                icon: "error",
                title: "No se pudo confirmar el depósito",
                text: data.error || "Intenta más tarde.",
            });
        }
    } catch (error) {
        console.error('Error confirmando depósito Stripe:', error);
        Swal.fire({
            icon: "error",
            title: "Error de conexión",
            text: "No se pudo verificar el pago con el servidor.",
        });
    }
}
