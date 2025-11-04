// src\controllers\login.js
const emailLogin = document.getElementById('email');
const passLogin = document.getElementById('password');
const actionLogin = document.getElementById('profiteering');

actionLogin.addEventListener('click', async () =>
{
    try
    {
        let email = emailLogin.value;
        let password = passLogin.value;

        if (email === "" || password === "") {

        } else {
            let credentials = { email, password };


            let requestBody = JSON.stringify(credentials);


            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody,
            });


            if (response.ok)
            {
                const  token  = await response.json();
                document.cookie = `token=${token};`;
                sessionStorage.setItem('token',token)
                goToIndex()
            }
            else
            {
                Swal.fire({
                    icon: "error",
                    title: "Salio algo mal",
                    text: "Contraseña o correo incorrecto!",
                });
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
});



/*
actionLogin.addEventListener('click', async () =>
{
    try
    {
        let email = emailLogin.value;
        let password = passLogin.value;

        if (email === "" || password === "") {
            console.log('Ingresar algo');
        } else {
            let credentials = { email, password };


            let requestBody = JSON.stringify(credentials);


            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody,
            });

            const modal = document.getElementById('myModal');
            const acceptButton = document.getElementById('acceptButton');

            function closeModalHandler() {
                modal.style.display = 'none';
                goToInit();
            }


            if (response.ok)
            {
                const  token  = await response.json();
                document.cookie = `token=${token};`;
                sessionStorage.setItem('token',token)
                goToIndex()
            }
            else
            {

                acceptButton.onclick = closeModalHandler;

                modal.style.display = 'block';
                window.onclick = function (event)
                {
                    if (event.target === modal)
                    {
                        closeModalHandler();
                    }
                };
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
});


 */
