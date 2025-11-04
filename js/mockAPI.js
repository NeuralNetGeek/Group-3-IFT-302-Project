// mockApi.js — actually fetches real weather data for Abuja
const API_KEY = "YOUR_API_KEY"; // <-- replace with your actual key later
const CITY = "Abuja";
const COUNTRY_CODE = "NG";

export async function getWeatherData() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY_CODE}&units=metric&appid=${API_KEY}`;
  const response = await fetch(url);
  const current = await response.json();

  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${CITY},${COUNTRY_CODE}&units=metric&appid=${API_KEY}`;
  const forecastRes = await fetch(forecastUrl);
  const forecast = await forecastRes.json();

  return { current, forecast };
}
