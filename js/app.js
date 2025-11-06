import { renderWeather, renderForecast } from "./ui.js";
import { applyTheme } from "./theme.js";

const API_KEY = "YOUR_API_KEY"; // Replace later
const DEFAULT_CITY = "Abuja";

async function getWeather(city = DEFAULT_CITY) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
  );
  if (!res.ok) throw new Error("City not found");
  return await res.json();
}

async function getForecast(city = DEFAULT_CITY) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
  );
  return await res.json();
}

async function init() {
  try {
    const weather = await getWeather();
    const forecast = await getForecast();

    renderWeather(weather);
    renderForecast(forecast);
    applyTheme(weather);

    const input = document.getElementById("search-input");
    input.addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        const city = e.target.value.trim();
        if (!city) return;
        const w = await getWeather(city);
        const f = await getForecast(city);
        renderWeather(w);
        renderForecast(f);
        applyTheme(w);
      }
    });
  } catch (err) {
    console.error("Weather data error:", err);
  }
}

document.addEventListener("DOMContentLoaded", init);