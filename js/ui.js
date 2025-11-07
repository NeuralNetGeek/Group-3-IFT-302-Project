// ui.js - UI Rendering and Theme Management
import { formatTime, saveToLocalStorage, getFromLocalStorage } from './app.js';

const weatherIconMap = {
  '01d': 'sun.svg',
  '01n': 'moon.svg',
  '02d': 'cloud-sun.svg',
  '02n': 'moon.svg',
  '03d': 'cloud.svg',
  '03n': 'cloud.svg',
  '04d': 'cloud.svg',
  '04n': 'cloud.svg',
  '09d': 'cloud-rain.svg',
  '09n': 'cloud-rain.svg',
  '10d': 'cloud-rain.svg',
  '10n': 'cloud-rain.svg',
  '11d': 'cloud-lightning.svg',
  '11n': 'cloud-lightning.svg',
  '13d': 'cloud-snow.svg',
  '13n': 'cloud-snow.svg',
  '50d': 'cloud-fog.svg',
  '50n': 'cloud-fog.svg',
};

function getLocalWeatherIcon(iconCode) {
  const fileName = weatherIconMap[iconCode] || 'cloud.svg';
  return `assets/icons/${fileName}`;
}

// Current unit state (Celsius or Fahrenheit)
let currentUnit = getFromLocalStorage('temperatureUnit') || 'C';

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
  
  // Update temperature unit symbols in the UI
  updateTemperatureSymbols();
  
  // Weather condition
  const condition = data.weather[0].description;
  setText('condition', capitalizeFirst(condition));
  setText('side-condition', capitalizeFirst(condition));
  
  // Weather icon
  const iconCode = data.weather[0].icon;
  const iconEl = document.getElementById('weather-icon');
  if (iconEl) {
    iconEl.src = getLocalWeatherIcon(iconCode);
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
  
  // Get one forecast per day (picking midday forecasts)
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
  
  // Update the 5 forecast cards
  const forecastSection = document.getElementById('forecast');
  if (!forecastSection) return;
  
  const forecastCards = forecastSection.querySelectorAll('[style*="width: 171.34px"][style*="height: 224px"]');
  
  dailyForecasts.forEach((forecast, index) => {
    if (index >= forecastCards.length) return;
    
    const card = forecastCards[index];
    const date = new Date(forecast.dt * 1000);
    
    // Format date
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    
    // Convert temperatures
    const tempMax = Math.round(convertTemp(forecast.main.temp_max, currentUnit));
    const tempMin = Math.round(convertTemp(forecast.main.temp_min, currentUnit));
    const unitSymbol = currentUnit === 'C' ? '°C' : '°F';
    
    // Weather info
    const condition = capitalizeFirst(forecast.weather[0].description);
    const iconCode = forecast.weather[0].icon;
    
    // Find and update day name
    const dayElements = card.querySelectorAll('[style*="font-size: 14px"][style*="color: white"][style*="text-align: center"]');
    if (dayElements[0]) dayElements[0].textContent = dayName;
    
    // Find and update date
    const dateElements = card.querySelectorAll('[style*="font-size: 12px"][style*="rgba(255, 255, 255, 0.60)"][style*="text-align: center"]');
    if (dateElements[0]) dateElements[0].textContent = `${month} ${day}`;
    
    // Update weather icon - inject actual image
    const iconContainer = card.querySelector('[style*="width: 32px"][style*="height: 32px"][style*="overflow: hidden"]');
    if (iconContainer) {
      iconContainer.innerHTML = `<img src="${getLocalWeatherIcon(iconCode)}" alt="${condition}" class="forecast-icon" />`;
    }
    
    // Update high temperature (18px white)
    const highTempElements = card.querySelectorAll('[style*="font-size: 18px"][style*="color: white"][style*="text-align: center"]');
    if (highTempElements.length >= 2) {
      highTempElements[0].textContent = tempMax;
      highTempElements[1].textContent = unitSymbol;
    }
    
    // Update low temperature (14px with 0.60 opacity)
    const lowTempElements = card.querySelectorAll('[style*="font-size: 14px"][style*="rgba(255, 255, 255, 0.60)"][style*="text-align: center"]');
    // Skip first element (date), use next two for temperature
    if (lowTempElements.length >= 3) {
      lowTempElements[1].textContent = tempMin;
      lowTempElements[2].textContent = unitSymbol;
    }
    
    // Update condition text
    const conditionElements = card.querySelectorAll('[style*="font-size: 12px"][style*="text-transform: capitalize"]');
    if (conditionElements[0]) conditionElements[0].textContent = condition;
  });
  
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
  
  // Save to localStorage
  saveToLocalStorage('temperatureUnit', unit);
  
  // Update button states with .active class
  const celsiusBtn = document.getElementById('celsius-btn');
  const fahrenheitBtn = document.getElementById('fahrenheit-btn');
  
  if (celsiusBtn && fahrenheitBtn) {
    if (unit === 'C') {
      celsiusBtn.classList.add('active');
      fahrenheitBtn.classList.remove('active');
    } else {
      celsiusBtn.classList.remove('active');
      fahrenheitBtn.classList.add('active');
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

/**
 * Update temperature unit symbols throughout the UI
 */
export function updateTemperatureSymbols() {
  const unitSymbol = currentUnit === 'C' ? '°C' : '°F';
  
  // Find all elements with degree symbols in the main weather display
  const allElements = document.querySelectorAll('div');
  
  allElements.forEach(el => {
    const text = el.textContent.trim();
    const style = el.getAttribute('style') || '';
    
    // Update main temperature symbol (72px font size)
    if (style.includes('font-size: 72px') && (text === '°C' || text === '°F')) {
      el.textContent = unitSymbol;
    }
    
    // Update feels like symbol (20px font size, after "Feels like")
    if (style.includes('font-size: 20px') && (text === '°C' || text === '°F')) {
      const parent = el.parentElement;
      if (parent && parent.textContent.includes('Feels like')) {
        el.textContent = unitSymbol;
      }
    }
  });
}
