// WEATHER DASHBOARD - 1440x1024, Figma Layout
// Updated selectors for new structure (search bar, no navs)

const MOCK_WEATHER = {
  current: {
    location: 'Abuja',
    country: 'NG',
    time: '07:30 AM',
    condition: 'Scattered Clouds',
    icon: '🌤️',
    temperature: 28,
    feels_like: 27,
    humidity: 78,
    pressure: 1012,
    wind_speed: 4.2,
    visibility: 9
  },
  forecast: [
    { date: 'Tue', desc: 'Light Rain', icon: '🌦️', temp: 30, feels_like: 24, date_long: 'Oct 28' },
    { date: 'Wed', desc: 'Broken Clouds', icon: '⛅', temp: 29, feels_like: 25, date_long: 'Oct 29' },
    { date: 'Thu', desc: 'Clear Sky', icon: '☀️', temp: 31, feels_like: 24, date_long: 'Oct 30' },
    { date: 'Fri', desc: 'Few Clouds', icon: '🌤️', temp: 30, feels_like: 25, date_long: 'Oct 31' },
    { date: 'Sat', desc: 'Scattered Clouds', icon: '🌥️', temp: 29, feels_like: 24, date_long: 'Nov 1' }
  ]
};

function fetchWeatherMock(unit = 'C') {
  return new Promise(res => {
    setTimeout(() => {
      if(unit === 'F') {
        let convert = c => Math.round(c * 9 / 5 + 32);
        let data = JSON.parse(JSON.stringify(MOCK_WEATHER));
        data.current.temperature = convert(data.current.temperature);
        data.current.feels_like = convert(data.current.feels_like);
        data.forecast.forEach(card => {
          card.temp = convert(card.temp);
          card.feels_like = convert(card.feels_like);
        });
        res({ ...data, unit: 'F' });
      } else {
        res({ ...MOCK_WEATHER, unit: 'C' });
      }
    }, 300);
  });
}

function setText(sel, text) {
  const el = document.querySelector(sel); if (el) el.textContent = text;
}

function updateDashboard(data) {
  setText('#sidebar-location', data.current.location);
  setText('#sidebar-condition', data.current.condition);
  setText('#sidebar-time', data.current.time);
  setText('#main-location', data.current.location + ', ' + data.current.country);
  setText('#dashboard-temp', data.current.temperature + (data.unit === 'F' ? '°F' : '°C'));
  setText('#dashboard-feels', data.current.feels_like + (data.unit === 'F' ? '°F' : '°C'));
  setText('#main-condition', data.current.condition);
  setText('#humidity', data.current.humidity + '%');
  setText('#pressure', data.current.pressure + ' hPa');
  setText('#wind', data.current.wind_speed + ' m/s');
  setText('#visibility', data.current.visibility + ' km');
  setText('#dashboard-update-time', 'Updated ' + data.current.time);
  // Icons: replace at img[src] when you have assets
  // document.querySelector('.weather-main-icon').src = ASSET_SRC;
}

function renderForecastCards(data) {
  const container = document.getElementById('forecast');
  container.innerHTML = '';
  data.forecast.forEach(card => {
    let tUnit = data.unit === 'F' ? '°F' : '°C';
    container.innerHTML += `
      <div class="forecast-card">
        <div class="forecast-date">${card.date}<div style="font-size:0.92em;opacity:0.57;font-weight:500;">${card.date_long}</div></div>
        <span class="forecast-icon">${card.icon}</span>
        <div class="forecast-temp">${card.temp}${tUnit}</div>
        <div class="forecast-feels">${card.feels_like}${tUnit}</div>
        <div class="forecast-desc">${card.desc}</div>
      </div>`;
  });
}

let currentUnit = 'C';
function selectUnit(unit) {
  if(unit === currentUnit) return;
  currentUnit = unit;
  document.getElementById('to-celsius').setAttribute('aria-pressed', unit==='C'?'true':'false');
  document.getElementById('to-fahrenheit').setAttribute('aria-pressed', unit==='F'?'true':'false');
  loadDashboard(unit);
}
document.getElementById('to-celsius').addEventListener('click',()=>selectUnit('C'));
document.getElementById('to-fahrenheit').addEventListener('click',()=>selectUnit('F'));

function loadDashboard(unit='C') {
  fetchWeatherMock(unit).then(weather => {
    updateDashboard(weather);
    renderForecastCards(weather);
  });
}
window.addEventListener('DOMContentLoaded',()=>{ loadDashboard('C'); });
