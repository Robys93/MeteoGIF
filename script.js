// Recupero elementi dalla pagina HTML
const htmlElement = document.documentElement;
const meteoLocation = document.querySelector('.meteo-location');
const meteoIcona = document.querySelector('.meteo-icona');
const meteoTemeperatura = document.querySelector('.meteo-temperatura');
const meteoSuggerimenti = document.querySelector('.meteo-suggerimenti');
const toggleBtn = document.getElementById('toggle-tema');
const selectCitta = document.getElementById('seleziona-citta');
const selectUnita = document.getElementById('unita');
const extraInfo = document.getElementById('extra-info');

let currentUnits = 'metric';

const suggestions = {
    '01d': 'Ricordati la crema solare!',
    '01n': 'Buonanotte!',
    '02d': 'Oggi il sole va e viene...',
    '02n': 'Attenti ai lupi mannari...',
    '03d': 'Luce perfetta per fare foto!',
    '03n': 'Dormi sereno :)',
    '04d': 'Che cielo grigio :(',
    '04n': 'Non si vede nemmeno la luna!',
    '09d': 'Prendi l\'ombrello',
    '09n': 'Copriti bene!',
    '10d': 'Prendi l\'ombrello',
    '10n': 'Copriti bene!',
    '11d': 'Attento ai fulmini!',
    '11n': 'I lampi accendono la notte!',
    '13d': 'Esci a fare un pupazzo di neve!',
    '13n': 'Notte perfetta per stare sotto il piumone!',
    '50d': 'Accendi i fendinebbia!',
    '50n': 'Guida con prudenza!'
};

const memeIcons = {
    '01d': 'https://media.giphy.com/media/3o7aCTPPm4OHfRLSH6/giphy.gif',
    '01n': 'https://media.giphy.com/media/l0HU7JI1nq8jH6QKI/giphy.gif',
    '02d': 'https://media.giphy.com/media/l2JHRhAtnJSDNJ2py/giphy.gif',
    '02n': 'https://media.giphy.com/media/l2JHRhAtnJSDNJ2py/giphy.gif',
    '03d': 'https://media.giphy.com/media/3ohzdIuqJoo8QdKlnW/giphy.gif',
    '03n': 'https://media.giphy.com/media/3ohzdIuqJoo8QdKlnW/giphy.gif',
    '04d': 'https://media.giphy.com/media/3ohzdIuqJoo8QdKlnW/giphy.gif',
    '04n': 'https://media.giphy.com/media/3ohzdIuqJoo8QdKlnW/giphy.gif',
    '09d': 'https://media.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.gif',
    '09n': 'https://media.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.gif',
    '10d': 'https://media.giphy.com/media/12hvLuCA0VUMRG/giphy.gif',
    '10n': 'https://media.giphy.com/media/12hvLuCA0VUMRG/giphy.gif',
    '11d': 'https://media.giphy.com/media/3o7TKsQ8UQ0Z6ZQq8w/giphy.gif',
    '11n': 'https://media.giphy.com/media/3o7TKsQ8UQ0Z6ZQq8w/giphy.gif',
    '13d': 'https://media.giphy.com/media/l0HU7JI1nq8jH6QKI/giphy.gif',
    '13n': 'https://media.giphy.com/media/l0HU7JI1nq8jH6QKI/giphy.gif',
    '50d': 'https://media.giphy.com/media/3ohzdIuqJoo8QdKlnW/giphy.gif',
    '50n': 'https://media.giphy.com/media/3ohzdIuqJoo8QdKlnW/giphy.gif',
    'default': 'https://media.giphy.com/media/l0HU7JI1nq8jH6QKI/giphy.gif'
};

const cittaCoordinate = {
    "Roma": { lat: 41.9028, lon: 12.4964 },
    "Milano": { lat: 45.4642, lon: 9.19 },
    "Napoli": { lat: 40.8522, lon: 14.2681 }
};

selectCitta.addEventListener('change', () => {
    const scelta = selectCitta.value;
    if (scelta === 'current') {
        navigator.geolocation.getCurrentPosition(on_success, on_error);
    } else if (cittaCoordinate[scelta]) {
        mostraMeteo(cittaCoordinate[scelta].lat, cittaCoordinate[scelta].lon);
    }
});

selectUnita.addEventListener('change', () => {
    currentUnits = selectUnita.value;
    const scelta = selectCitta.value;
    if (scelta === 'current') {
        navigator.geolocation.getCurrentPosition(on_success, on_error);
    } else if (cittaCoordinate[scelta]) {
        mostraMeteo(cittaCoordinate[scelta].lat, cittaCoordinate[scelta].lon);
    }
});

function on_error() {
    meteoLocation.innerText = '';
    meteoIcona.src = "images/geolocation_disabled.png";
    meteoIcona.alt = "Geolocalizzazione disattivata";
    meteoSuggerimenti.innerText = 'Attivare la geolocalizzazione';
    htmlElement.className = '';
}

function on_success(position) {
    mostraMeteo(position.coords.latitude, position.coords.longitude);
}

async function mostraMeteo(lat, long) {
    const API_KEY = '651211c390ecb7765704dfeedbe397da';
    const lang = 'it';
    const endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=${currentUnits}&lang=${lang}`;

    const response = await fetch(endpoint);
    const data = await response.json();

    const icon = data.weather[0].icon;
    const description = data.weather[0].description;
    const hour = new Date(data.dt * 1000).getHours();
    const windSpeed = data.wind.speed;
    const windDeg = data.wind.deg;
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const direction = directions[Math.round(windDeg / 45) % 8];

    meteoLocation.innerText = data.name;
    meteoIcona.src = memeIcons[icon] || memeIcons['default'];
    meteoIcona.alt = description;
    meteoTemeperatura.innerText = Math.floor(data.main.temp) + (currentUnits === 'metric' ? '°C' : '°F');
    meteoSuggerimenti.innerText = suggestions[icon] || '';
    extraInfo.innerHTML = `Vento: ${windSpeed} ${currentUnits === 'metric' ? 'm/s' : 'mph'} da ${direction}`;
    if (hour >= 20 || hour < 6) {
        htmlElement.classList.add('tema-scuro');
    } else {
        htmlElement.classList.remove('tema-scuro');
    }

    htmlElement.classList.remove('js-loading');
}

toggleBtn.addEventListener('click', () => {
    htmlElement.classList.toggle('tema-scuro');
});

navigator.geolocation.getCurrentPosition(on_success, on_error);
