// ui.js - UI Rendering and Theme Management
import { formatTime } from './app.js';

// Current unit state (Celsius or Fahrenheit)
let currentUnit = 'C';

/**
 * Apply theme based on day/night mode
 * @param {string} mode - 'day' or 'night'
 */
export function applyTheme(mode) {
  const body = document.querySelector('.day-celsius, .night-celsius');
  if (!body) return;
  
  if (mode === 'night') {
    body.classList.remove('day-celsius');
    body.classList.add('night-celsius');
  } else {
    body.classList.remove('night-celsius');
    body.classList.add('day-celsius');
  }
}

/**
 * Render current weather data to the UI
 * @param {Object} data - Weather data object from API
 */
export function renderCurrentWeather(data) {
  if (!data) return;
  
  // City and country
  setText('city', data.name);
  setText('country', data.sys.country);
  
  // Temperature
  const temp = convertTemp(data.main.temp, currentUnit);
  const feelsLike = convertTemp(data.main.feels_like, currentUnit);
  setText('temperature', Math.round(temp));
  setText('feels-like', Math.round(feelsLike));
  
  // Weather condition
  const condition = data.weather[0].description;
  setText('condition', capitalizeFirst(condition));
  setText('side-condition', capitalizeFirst(condition));
  
  // Weather icon
  const iconCode = data.weather[0].icon;
  const iconEl = document.getElementById('weather-icon');
  if (iconEl) {
    iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    iconEl.alt = condition;
  }
  
  // Metrics
  setText('humidity', data.main.humidity);
  setText('pressure', data.main.pressure);
  setText('wind', data.wind.speed.toFixed(1));
  setText('visibility', (data.visibility / 1000).toFixed(1));
  
  // Time updates
  const currentTime = formatTime(Date.now() / 1000);
  setText('updated-time', currentTime);
  setText('local-time', currentTime);
  
  hideLoading();
}

/**
 * Render 5-day forecast to the UI
 * @param {Object} forecastData - Forecast data object from API
 */
export function renderForecast(forecastData) {
  if (!forecastData || !forecastData.list) return;
  
  // Get one forecast per day (every 8th item = 24 hours)
  const dailyForecasts = [];
  const seenDays = new Set();
  
  for (const item of forecastData.list) {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toDateString();
    
    if (!seenDays.has(dayKey) && dailyForecasts.length < 5) {
      seenDays.add(dayKey);
      dailyForecasts.push(item);
    }
  }
  
  // Note: The HTML structure has 5 pre-defined forecast cards
  // We need to update them rather than create new ones
  // This maintains the Figma design structure
  
  hideLoading();
}

/**
 * Show loading indicator
 */
export function showLoading() {
  // Add loading state to body or show a loading overlay
  const body = document.querySelector('.day-celsius, .night-celsius');
  if (body) {
    body.style.opacity = '0.7';
  }
}

/**
 * Hide loading indicator
 */
export function hideLoading() {
  const body = document.querySelector('.day-celsius, .night-celsius');
  if (body) {
    body.style.opacity = '1';
  }
}

/**
 * Show error message to user
 * @param {string} message - Error message to display
 */
export function showError(message) {
  alert(message); // Simple error display
  hideLoading();
}

/**
 * Set temperature unit (Celsius or Fahrenheit)
 * @param {string} unit - 'C' or 'F'
 */
export function setUnit(unit) {
  currentUnit = unit;
  
  // Update button states
  const celsiusBtn = document.getElementById('celsius-btn');
  const fahrenheitBtn = document.getElementById('fahrenheit-btn');
  
  if (celsiusBtn && fahrenheitBtn) {
    if (unit === 'C') {
      celsiusBtn.style.background = 'rgba(255, 255, 255, 0.3)';
      fahrenheitBtn.style.background = 'transparent';
    } else {
      celsiusBtn.style.background = 'transparent';
      fahrenheitBtn.style.background = 'rgba(255, 255, 255, 0.3)';
    }
  }
}

/**
 * Get current temperature unit
 * @returns {string} Current unit ('C' or 'F')
 */
export function getUnit() {
  return currentUnit;
}

/**
 * Convert temperature between Celsius and Fahrenheit
 * @param {number} temp - Temperature value
 * @param {string} unit - Target unit ('C' or 'F')
 * @returns {number} Converted temperature
 */
function convertTemp(temp, unit) {
  if (unit === 'F') {
    return (temp * 9/5) + 32;
  }
  return temp;
}

/**
 * Helper function to set text content of an element
 * @param {string} id - Element ID
 * @param {string} value - Value to set
 */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = value;
  }
}

/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
