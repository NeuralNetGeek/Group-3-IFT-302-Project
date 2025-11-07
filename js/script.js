// script.js - Event Handlers and User Interactions
import { 
  fetchWeather, 
  fetchForecast,
  fetchWeatherByCoords,
  fetchForecastByCoords,
  detectDayNight,
  addToSearchHistory,
  getFromLocalStorage
} from './app.js';

import { 
  renderCurrentWeather, 
  renderForecast,
  applyTheme,
  showError,
  showLoading,
  setUnit,
  getUnit,
  updateTemperatureSymbols
} from './ui.js';

const DEFAULT_CITY = 'Abuja';

/**
 * Initialize the application
 */
async function init() {
  // Check if there's a city in URL params (from history page)
  const urlParams = new URLSearchParams(window.location.search);
  const cityFromUrl = urlParams.get('city');
  
  // Get last city from localStorage or use default
  const lastCity = cityFromUrl || getFromLocalStorage('lastCity') || DEFAULT_CITY;
  
  // Load weather data
  await loadWeatherData(lastCity);
  
  // Setup event listeners
  setupEventListeners();
  
  // Load saved unit preference
  const savedUnit = getFromLocalStorage('temperatureUnit') || 'C';
  setUnit(savedUnit);
  
  // Update temperature symbols to match loaded unit
  updateTemperatureSymbols();
}

/**
 * Load weather data for a city
 * @param {string} city - City name to load
 */
async function loadWeatherData(city) {
  try {
    showLoading();
    
    // Fetch weather and forecast
    const weatherData = await fetchWeather(city);
    const forecastData = await fetchForecast(city);
    
    // Render UI
    renderCurrentWeather(weatherData);
    renderForecast(forecastData);
    
    // Apply theme based on day/night
    const theme = detectDayNight(weatherData);
    applyTheme(theme);
    
    // Add to search history
    addToSearchHistory(city);
    
  } catch (error) {
    console.error('Error loading weather data:', error);
    showError(`Could not load weather data for ${city}. Please try again.`);
  }
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  // Search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('keypress', handleSearch);
  }
  
  // Unit toggle buttons
  const celsiusBtn = document.getElementById('celsius-btn');
  const fahrenheitBtn = document.getElementById('fahrenheit-btn');
  
  if (celsiusBtn) {
    celsiusBtn.addEventListener('click', () => handleUnitToggle('C'));
  }
  
  if (fahrenheitBtn) {
    fahrenheitBtn.addEventListener('click', () => handleUnitToggle('F'));
  }
}

/**
 * Handle search input
 * @param {KeyboardEvent} event - Keyboard event
 */
async function handleSearch(event) {
  if (event.key === 'Enter') {
    const city = event.target.value.trim();
    if (city) {
      await loadWeatherData(city);
      event.target.value = ''; // Clear input
    }
  }
}

/**
 * Handle unit toggle (Celsius/Fahrenheit)
 * @param {string} unit - Unit to switch to ('C' or 'F')
 */
async function handleUnitToggle(unit) {
  if (unit === getUnit()) return; // Already on this unit
  
  setUnit(unit);
  
  // Reload current weather data with new unit
  const lastCity = getFromLocalStorage('lastCity') || DEFAULT_CITY;
  const weatherData = getFromLocalStorage('lastWeather');
  const forecastData = getFromLocalStorage('lastForecast');
  
  if (weatherData) {
    renderCurrentWeather(weatherData);
  }
  
  if (forecastData) {
    renderForecast(forecastData);
  }
  
  // Update all temperature symbols in the UI
  updateTemperatureSymbols();
}

/**
 * Request and handle geolocation
 * Used by location.html page
 */
export async function requestGeolocation() {
  if (!navigator.geolocation) {
    showError('Geolocation is not supported by your browser');
    return;
  }
  
  showLoading();
  
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        
        // Fetch weather by coordinates
        const weatherData = await fetchWeatherByCoords(latitude, longitude);
        const forecastData = await fetchForecastByCoords(latitude, longitude);
        
        // Render UI
        renderCurrentWeather(weatherData);
        renderForecast(forecastData);
        
        // Apply theme
        const theme = detectDayNight(weatherData);
        applyTheme(theme);
        
      } catch (error) {
        console.error('Error loading location weather:', error);
        showError('Could not load weather data for your location');
      }
    },
    (error) => {
      console.error('Geolocation error:', error);
      showError('Location access denied. Please enable location services.');
    }
  );
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
