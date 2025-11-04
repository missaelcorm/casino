// src\controllers\register.js
const nameR = document.getElementById('name');
const ageR = document.getElementById('age');
const emailR = document.getElementById('email');
const passwordR = document.getElementById('password');
const passwordRepit = document.getElementById('Repitpassword');
const actionRegister = document.getElementById('regiteering')
const favDialog = document.getElementById('favDialog');



/*
// TESTER

actionRegister.addEventListener('click', async () => {
    const modal = document.getElementById('myModal');
    const acceptButton = document.getElementById('acceptButton');

    modal.style.display = 'block';

    function closeModalHandler() {
        modal.style.display = 'none';
        //goToInit();
    }

    acceptButton.onclick = closeModalHandler;

    window.onclick = function (event)
    {
        if (event.target === modal)
        {
            closeModalHandler();
        }
    };
    })
 */


/*
actionRegister.addEventListener('click', async () => {
    try
    {
        // Obtener los valores del formulario
        const userName = nameR.value;
        const userAge = ageR.value;
        const userEmail = emailR.value;
        const userPassword = passwordR.value;
        const userPasswordRepeat = passwordRepit.value;

        if (userPassword !== userPasswordRepeat)
        {
            console.log('Las contraseñas no coinciden');
            return;
        }

        const userData = {
            name: userName,
            age: userAge,
            email: userEmail,
            password: userPassword,
        };


        const requestBody = JSON.stringify(userData);

        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: requestBody,
        });

        if (response.ok)
        {
            const modal = document.getElementById('myModal');
            const acceptButton = document.getElementById('acceptButton');

            modal.style.display = 'block';


            function closeModalHandler() {
                modal.style.display = 'none';
                goToInit();
            }

            acceptButton.onclick = closeModalHandler;

            window.onclick = function (event)
            {
                if (event.target === modal)
                {
                    closeModalHandler();
                }
            };

        }
        else
        {
            console.log('Error en el registro');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
 */


actionRegister.addEventListener('click', async () => {
    try
    {
        // Obtener los valores del formulario
        const userName = nameR.value;
        const userAge = ageR.value;
        const userEmail = emailR.value;
        const userPassword = passwordR.value;
        const userPasswordRepeat = passwordRepit.value;

        if (userPassword !== userPasswordRepeat)
        {
            Swal.fire({
                icon: "error",
                title: "Sucedio un error.",
                text: "Las contraseñas no coinciden!",
            });
            return;
        }

        const userData = {
            name: userName,
            age: userAge,
            email: userEmail,
            password: userPassword,
        };


        const requestBody = JSON.stringify(userData);

        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: requestBody,
        });

        if (response.ok)
        {
            Swal.fire({
                icon: "success",
                title: "Se ha registrado con exito",
                showConfirmButton: false,
                timer: 1500
            });

            setTimeout(function() {
                goToInit();
            }, 1500);
        }
        else
        {
            Swal.fire({
                icon: "error",
                title: "Sucedio un error.",
                text: "No se completo el registro, vuelve a intentarlo!",
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
