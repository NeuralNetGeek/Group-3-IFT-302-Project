// ============================
// Weather Dashboard - Main Script
// ============================

//  Configuration
const API_BASE = "https://api.openweathermap.org/data/2.5/weather";
const API_FORECAST = "https://api.openweathermap.org/data/2.5/forecast";
// 🔑 Insert your API key below later
const API_KEY = "YOUR_API_KEY_HERE";

// Default location
let currentCity = "Abuja";
let units = "metric"; // metric = Celsius, imperial = Fahrenheit

// ============================
//  DOM Elements
// ============================
const cityEl = document.getElementById("cityName");
const tempEl = document.getElementById("temperature");
const feelsEl = document.getElementById("feelsLike");
const descEl = document.getElementById("weatherDescription");
const humidityEl = document.getElementById("humidity");
const pressureEl = document.getElementById("pressure");
const windEl = document.getElementById("windSpeed");
const visibilityEl = document.getElementById("visibility");
const updatedTimeEl = document.getElementById("updatedTime");
const forecastEl = document.getElementById("forecast");
const weatherIconEl = document.getElementById("weatherIcon");

// Toggle buttons
const celsiusBtn = document.getElementById("celsiusBtn");
const fahrenheitBtn = document.getElementById("fahrenheitBtn");

// ============================
//  Auto Mode Switch (Day ↔ Night)
// ============================
function setModeByTime() {
  const hour = new Date().getHours();
  const isNight = hour >= 18 || hour < 6;
  document.body.classList.toggle("night-celsius", isNight);
  document.body.classList.toggle("day-celsius", !isNight);
}

// ============================
//  Fetch Weather Data
// ============================
async function fetchWeather(city = currentCity) {
  try {
    const response = await fetch(
      `${API_BASE}?q=${city}&units=${units}&appid=${API_KEY}`
    );
    const data = await response.json();
    if (data.cod !== 200) throw new Error(data.message);
    updateUI(data);
  } catch (error) {
    console.error("Weather fetch error:", error);
  }
}

// ============================
//  Fetch 5-Day Forecast
// ============================
async function fetchForecast(city = currentCity) {
  try {
    const response = await fetch(
      `${API_FORECAST}?q=${city}&units=${units}&appid=${API_KEY}`
    );
    const data = await response.json();
    if (data.cod !== "200") throw new Error(data.message);
    updateForecastUI(data.list);
  } catch (error) {
    console.error("Forecast fetch error:", error);
  }
}

// ============================
//  UI Updates
// ============================
function updateUI(data) {
  const weather = data.weather[0];
  const main = data.main;
  const wind = data.wind;
  const visibility = data.visibility / 1000;

  cityEl.textContent = `${data.name}`;
  descEl.textContent = weather.description;
  tempEl.textContent = Math.round(main.temp);
  feelsEl.textContent = Math.round(main.feels_like);
  humidityEl.textContent = main.humidity;
  pressureEl.textContent = main.pressure;
  windEl.textContent = wind.speed;
  visibilityEl.textContent = visibility.toFixed(1);
  updatedTimeEl.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Set weather icon
  const iconCode = weather.icon;
  weatherIconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// ============================
//  Forecast Cards
// ============================
function updateForecastUI(list) {
  forecastEl.innerHTML = "";

  // Pick every 8th forecast (24-hour interval)
  const daily = list.filter((_, i) => i % 8 === 0).slice(0, 5);

  daily.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    const dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const icon = item.weather[0].icon;
    const desc = item.weather[0].main;
    const max = Math.round(item.main.temp_max);
    const min = Math.round(item.main.temp_min);

    const card = document.createElement("div");
    card.classList.add("forecast-card");
    card.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${desc}" />
      <h3>${max}° / ${min}°</h3>
      <p>${desc}</p>
      <span>${day}, ${dateStr}</span>
    `;
    forecastEl.appendChild(card);
  });
}

// ============================
//  Unit Toggle
// ============================
function switchUnits(newUnit) {
  if (units === newUnit) return;
  units = newUnit;

  celsiusBtn.classList.toggle("active", newUnit === "metric");
  fahrenheitBtn.classList.toggle("active", newUnit === "imperial");

  fetchWeather();
  fetchForecast();
}

// ============================
//  Init
// ============================
document.addEventListener("DOMContentLoaded", () => {
  setModeByTime();
  fetchWeather();
  fetchForecast();

  celsiusBtn.addEventListener("click", () => switchUnits("metric"));
  fahrenheitBtn.addEventListener("click", () => switchUnits("imperial"));
});
