const text = document.getElementById('textProf')
const loader = document.getElementById('preloader')

window.addEventListener('load', () => {
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 1500);
        }, 1000);
    }
})

document.addEventListener('DOMContentLoaded', () => {
    loadName()
});

function loadName() {
    const token = sessionStorage.getItem('token');

    if (!token) {
        return;
    }

    fetch(getApiUrl(API_CONFIG.ENDPOINTS.GET_USER_NAME), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    }).then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener el nombre desde el servidor');
        }
        return response.json();
    }).then(data => {
        const textProf = document.getElementById('textProf');
        if (textProf) {
            textProf.innerText = data.name;
        }
    }).catch(error => console.error('Error en la solicitud al servidor:', error));
}

let defaultTransform = 0;

function getBaseURL() {
    return window.location.origin;
}

function navigateToPath(path) {
    const baseURL = getBaseURL();
    window.location.href = `${baseURL}/${path}`;
}

function goToIndex() {
    navigateToPath('index_login.html');
}

function goToIndexPending() {
    navigateToPath('index_logInPending.html');
}

function goToInfo() {
    navigateToPath('info.html');
}

function goToRules() {
    navigateToPath('rules.html');
}

function goToProfile() {
    navigateToPath('profile.html');
}

function goToExit() {
    sessionStorage.removeItem('token')
    document.cookie = 'token=; Expires=0;';
    navigateToPath('index_logInPending.html');
}

function goToBalance() {
    navigateToPath('balance.html');
}

function goToActivity() {
    navigateToPath('activity.html');
}

function goToInit() {
    navigateToPath('logIn.html');
}

function goToReg() {
    navigateToPath('register.html');
}

function redirectToGame(gamePath) {
    navigateToPath(gamePath);
}