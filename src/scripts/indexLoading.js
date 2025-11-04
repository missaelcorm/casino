    // src\scripts\index_loading.js
    const text = document.getElementById('textProf')
    const loader = document.getElementById('preloader')
    window.addEventListener('load', () =>{
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 1500);
        }, 1000);
    })



    document.addEventListener('DOMContentLoaded', () => {
        loadName()
    });

    function loadName()
    {
        const token = sessionStorage.getItem('token');

        if (!token)
        {
            return;
        }

        let currentURL = getBaseURL();

            fetch(`${currentURL}/getUserName`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
        }).then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener el nombre desde el servidor');
                }
                return response.json();
            }).then(data => {
                const textProf = document.getElementById('textProf');
                textProf.innerText = data.name;
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

    function goToIndex()
    {
        navigateToPath('index');
    }

    function goToIndexPending()
    {
        navigateToPath('/');
    }

    function goToInfo()
    {
        navigateToPath('information');
    }

    function goToRules()
    {
        navigateToPath('rules');
    }

    function goToProfile()
    {
        navigateToPath('profile');
    }

    /*
    function imprimirTodasLasCookies() {
        const cookies = document.cookie.split(';');

        console.log("Todas las cookies:");

        for (let i = 0; i < cookies.length; i++) {
            console.log(cookies[i].trim());
        }
    }
    */


    function goToExit()
    {
        sessionStorage.removeItem('token')
        document.cookie = 'token=; Expires=0;';
        navigateToPath('/');
    }

    function goToBalance()
    {
        navigateToPath('profile/balance');
    }

    function goToActivity()
    {
        navigateToPath('profile/activity');
    }

    function goToInit()
    {
        navigateToPath('login');
    }

    function goToReg()
    {
        navigateToPath('register');
    }

    function redirectToGame(gamePath) {
        const baseURL = getBaseURL();
        const fullURL = `${baseURL}/games/${gamePath}`;
        window.location.href = fullURL;
        console.log(fullURL);
    }