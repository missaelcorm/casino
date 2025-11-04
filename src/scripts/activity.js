// src\scripts\activity.js
const xhr = new XMLHttpRequest();
const imagesMap = new Map();
imagesMap.set('Crash', '/assets/images/crash_car.png');
imagesMap.set('Diamonds', '/assets/images/diamonds_car.png');
imagesMap.set('Hi-Lo', '/assets/images/hilo_car.png');
imagesMap.set('Limbo', '/assets/images/limbo_prox.png');
imagesMap.set('Ruleta', '/assets/images/roulette_car.png');
imagesMap.set('Slide', '/assets/images/slide_prox.png');
imagesMap.set('Slot', '/assets/images/slots_car.png');
imagesMap.set('Poker', '/assets/images/videoPoker_prox.png');
imagesMap.set('Mines', '/assets/images/mine.jpg');

document.addEventListener('DOMContentLoaded', () => {
    loadActivity();

});

function loadActivity() {
    var id = sessionStorage.getItem('token');
    var url = `/profile/activity?id=${id}`;

    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText); 
        } else { 
            if (xhr.status === 200) {
                let activities = JSON.parse(xhr.responseText);
                console.log(activities);

                // Set up container
                let container = document.querySelector('.activity-container-content');

                // Iterate and add every activity
                activities.forEach((activity) => {
                    let row = document.createElement('div');
                    row.classList.add('activity-container-content-row');

                    // Give each one a column style
                    let titleColumn = document.createElement('div');
                    titleColumn.classList.add('activity-container-content-column');
                    let dateColumn = document.createElement('div');
                    dateColumn.classList.add('activity-container-content-column');
                    let amountColumn = document.createElement('div');
                    amountColumn.classList.add('activity-container-content-column');

                    // Title column style
                    titleColumn.innerHTML = `
                        <div class="game">
                            <img src="${imagesMap.get(activity.nameGame)}">
                            <span>${activity.nameGame}</span>
                        </div> 
                    `;

                    // Date column style
                    [yyyy,mm,dd,hh,mi] = activity.dateGame.split(/[/:\-T]/);
                    date = `${dd}-${mm}-${yyyy} ${hh}:${mi}`;

                    dateColumn.innerHTML = `
                        <div class="game">
                            <span>${date}</span>
                        </div> 
                    `;
                    
                    // Amount column style
                    var balance = parseFloat(activity.balance);
                    if (balance >= 0) {
                        balance = `${balance} USD`;
                        amountColumn.innerHTML = `
                            <div class="game">
                                <span class="amount positive">${balance}</span>
                            </div> 
                        `;
                    } else {
                        balance = `${balance} USD`;
                        amountColumn.innerHTML = `
                            <div class="game">
                                <span class="amount negative">${balance}</span>
                            </div> 
                        `;
                    }


                    // Append to row
                    row.append(titleColumn);
                    row.append(dateColumn);
                    row.append(amountColumn);

                    // Append to table
                    container.append(row);
                });
            }
        }
    };
    xhr.send();

}