const gameImageNames = {
    'Crash': 'crash_car',
    'Diamonds': 'diamonds_car',
    'Hi-Lo': 'hilo_car',
    'Limbo': 'limbo_prox',
    'Ruleta': 'roulette_car',
    'Slide': 'slide_prox',
    'Slot': 'slots_car',
    'Poker': 'videoPoker_prox',
    'Mines': 'mine'
};

let imagesFromS3 = {};

document.addEventListener('DOMContentLoaded', async () => {
    await loadImagesFromS3();
    loadActivity();
});

async function loadImagesFromS3() {
    try {
        imagesFromS3 = await assetsService.getImages();
    } catch (error) {
        imagesFromS3 = {};
    }
}

function getGameImageUrl(gameName) {
    const imageName = gameImageNames[gameName];
    if (imageName && imagesFromS3[imageName]) {
        return imagesFromS3[imageName];
    }
    return `assets/images/${imageName || 'default'}.png`;
}

function loadActivity() {
    const xhr = new XMLHttpRequest();
    var id = localStorage.getItem('userId');
    var token = localStorage.getItem('token');
    var url = getApiUrl(API_CONFIG.ENDPOINTS.ACTIVITY) + `?id=${id}`;

    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    
    xhr.onload = function() {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText); 
        } else { 
            if (xhr.status === 200) {
                let activities = JSON.parse(xhr.responseText);

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

                    const imageUrl = getGameImageUrl(activity.nameGame);
                    
                    titleColumn.innerHTML = `
                        <div class="game">
                            <img src="${imageUrl}">
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
