// src\scripts\profile.js
const xhr = new XMLHttpRequest();

document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
});

function loadProfile() {
    var id = sessionStorage.getItem('token');
    var url = `/profile?id=${id}`;

    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText); 
        } else { 
            if (xhr.status === 200) {
                let usernameField = document.querySelector('#account-input-username');
                let emailField = document.querySelector('#account-input-email');
                let passwordField = document.querySelector('#account-input-password');
                let ageField = document.querySelector('#account-input-age');
                let usernameBoldField = document.querySelector('#account-bold-username');

                let data = JSON.parse(xhr.responseText);
                usernameField.value = data.name;
                usernameField.dataset.prev = data.name;

                passwordField.value = data.password;
                passwordField.dataset.prev = data.password;

                emailField.value = data.email;
                emailField.dataset.prev = data.email;

                ageField.innerHTML = data.age + " " + "años";
                usernameBoldField.innerHTML = data.name;

            }
        }
    };
    xhr.send();
}


function confirm(component) {
    let components = getFields(component);
    let field = components[0];
    let confirm = components[1];
    let cancel = components[2];
    let span = components[3];

    // Change styles
    field.disabled = true;
    field.classList.add('account-input');
    field.classList.remove('editing');

    // Add confirm and delete buttons
    span.style.display = 'block';
    confirm.style.display = 'none';
    cancel.style.display = 'none';

    // Update previous value
    field.dataset.prev = field.value;
    updateField(component, field.value); 
}

function updateField(field, newValue) {
    var id = sessionStorage.getItem('token');

    let data = {
        id: id,
        field: field,
        newValue: newValue
    }
    data = JSON.stringify(data);

    xhr.open('PUT', `/profile`, false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText); 
        } else { 
            if (xhr.status === 200) {
                data = JSON.parse(xhr.responseText);
                console.log(data);
                document.querySelector('#account-bold-username').innerHTML = data.name;
                document.querySelector('#textProf').innerHTML = data.name;
            }
        }
    };
    xhr.send(data);
}


function cancel(component) {
    let components = getFields(component);
    let field = components[0];
    let confirm = components[1];
    let cancel = components[2];
    let span = components[3];

    // Change styles
    field.disabled = true;
    field.classList.add('account-input');
    field.classList.remove('editing');

    // Add confirm and delete buttons
    span.style.display = 'block';
    confirm.style.display = 'none';
    cancel.style.display = 'none';

    // Change value to the previous one
    field.value = field.dataset.prev;

}

function getFields(component) {
    let field = document.querySelector(`#account-input-${component}`);
    let confirm = document.querySelector(`#account-input-${component}-confirm`);
    let cancel = document.querySelector(`#account-input-${component}-cancel`);
    let span = document.querySelector(`#account-input-${component}-span`);

    let components = [];
    components.push(field);
    components.push(confirm);
    components.push(cancel);
    components.push(span);

    return components;
}

function edit(component) {
    let components = getFields(component);
    let field = components[0];
    let confirm = components[1];
    let cancel = components[2];
    let span = components[3];

    // Change styles
    field.disabled = false;
    field.classList.remove('account-input');
    field.classList.add('editing');

    // Add confirm and delete buttons
    span.style.display = 'none';
    confirm.style.display = 'block';
    cancel.style.display = 'block';
}
