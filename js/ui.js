// ui.js - UI Rendering and Theme Management
import { formatTime, saveToLocalStorage, getFromLocalStorage } from './app.js';

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
  
  // Get one forecast per day at noon (12:00:00)
  const dailyForecasts = [];
  const seenDays = new Set();
  
  for (const item of forecastData.list) {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toDateString();
    const hour = date.getHours();
    
    // Prefer noon forecasts for better representation
    if (!seenDays.has(dayKey) && dailyForecasts.length < 5) {
      if (hour >= 11 && hour <= 14) {
        seenDays.add(dayKey);
        dailyForecasts.push(item);
      } else if (!seenDays.has(dayKey) && dailyForecasts.length < 5) {
        // Fallback: take first available for this day
        seenDays.add(dayKey);
        dailyForecasts.push(item);
      }
    }
  }
  
  // Update the 5 forecast cards in the HTML
  const forecastSection = document.getElementById('forecast');
  if (!forecastSection) return;
  
  const forecastCards = forecastSection.querySelectorAll('[style*="width: 171.34px"]');
  
  dailyForecasts.forEach((forecast, index) => {
    if (index >= forecastCards.length) return;
    
    const card = forecastCards[index];
    const date = new Date(forecast.dt * 1000);
    
    // Day name (e.g., "Mon", "Tue")
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Temperatures
    const tempMax = convertTemp(forecast.main.temp_max, currentUnit);
    const tempMin = convertTemp(forecast.main.temp_min, currentUnit);
    // Use just the degree symbol for high temp, full unit for low temp in Fahrenheit
    const highTempSymbol = currentUnit === 'C' ? '\u00b0C' : '\u00b0F';
    const lowTempSymbol = currentUnit === 'C' ? '\u00b0C' : '\u00b0F';
    
    // Condition
    const condition = forecast.weather[0].description;
    const iconCode = forecast.weather[0].icon;
    
    // Update day name
    const dayElement = card.querySelector('[style*="Tue"], [style*="Wed"], [style*="Thu"], [style*="Fri"], [style*="Sat"], [style*="Mon"], [style*="Sun"]');
    if (dayElement) dayElement.textContent = dayName;
    
    // Update date
    const dateElement = card.querySelector('[style*="Oct"]');
    if (dateElement) dateElement.textContent = monthDay;
    
    // Update max temp
    const maxTempElements = card.querySelectorAll('[style*="font-size: 18px"][style*="color: white"]');
    if (maxTempElements[0]) maxTempElements[0].textContent = Math.round(tempMax);
    if (maxTempElements[1]) maxTempElements[1].textContent = highTempSymbol;
    
    // Update min temp
    const minTempElements = card.querySelectorAll('[style*="font-size: 14px"][style*="rgba(255, 255, 255, 0.60)"]');
    if (minTempElements[0]) minTempElements[0].textContent = Math.round(tempMin);
    if (minTempElements[1]) minTempElements[1].textContent = lowTempSymbol;
    
    // Update condition
    const conditionElement = card.querySelector('[style*="text-transform: capitalize"][style*="font-size: 12px"]');
    if (conditionElement) conditionElement.textContent = capitalizeFirst(condition);
    
    // Update icon
    const iconElement = card.querySelector('img, [style*="overflow: hidden"]');
    if (iconElement && iconElement.tagName === 'IMG') {
      iconElement.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      iconElement.alt = condition;
    }
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
