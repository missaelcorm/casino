const xhr = new XMLHttpRequest();
const imagesMap = new Map();
imagesMap.set('Crash', 'assets/images/crash_car.png');
imagesMap.set('Diamonds', 'assets/images/diamonds_car.png');
imagesMap.set('Hi-Lo', 'assets/images/hilo_car.png');
imagesMap.set('Limbo', 'assets/images/limbo_prox.png');
imagesMap.set('Ruleta', 'assets/images/roulette_car.png');
imagesMap.set('Slide', 'assets/images/slide_prox.png');
imagesMap.set('Slot', 'assets/images/slots_car.png');
imagesMap.set('Poker', 'assets/images/videoPoker_prox.png');
imagesMap.set('Mines', 'assets/images/mine.jpg');

document.addEventListener('DOMContentLoaded', () => {
    loadActivity();
});

function loadActivity() {
    var id = sessionStorage.getItem('token');
    var url = getApiUrl(API_CONFIG.ENDPOINTS.ACTIVITY) + `?id=${id}`;

    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.withCredentials = true;
    
    xhr.onload = function() {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText); 
        } else { 
            if (xhr.status === 200) {
                let activities = JSON.parse(xhr.responseText);
                console.log(activities);

                let container = document.querySelector('.activity-container-content');

                activities.forEach((activity) => {
                    let row = document.createElement('div');
                    row.classList.add('activity-container-content-row');

                    let titleColumn = document.createElement('div');
                    titleColumn.classList.add('activity-container-content-column');
                    let dateColumn = document.createElement('div');
                    dateColumn.classList.add('activity-container-content-column');
                    let amountColumn = document.createElement('div');
                    amountColumn.classList.add('activity-container-content-column');

                    titleColumn.innerHTML = `
                        <div class="game">
                            <img src="${imagesMap.get(activity.nameGame)}">
                            <span>${activity.nameGame}</span>
                        </div> 
                    `;

                    const dateUTC = new Date(activity.dateGame);
                    const day = String(dateUTC.getDate()).padStart(2, '0');
                    const month = String(dateUTC.getMonth() + 1).padStart(2, '0');
                    const year = dateUTC.getFullYear();
                    const hours = String(dateUTC.getHours()).padStart(2, '0');
                    const minutes = String(dateUTC.getMinutes()).padStart(2, '0');
                    
                    const date = `${day}-${month}-${year} ${hours}:${minutes}`;

                    dateColumn.innerHTML = `
                        <div class="game">
                            <span>${date}</span>
                        </div> 
                    `;
                    
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

                    row.append(titleColumn);
                    row.append(dateColumn);
                    row.append(amountColumn);

                    container.append(row);
                });
            }
        }
    };
    xhr.send();
}