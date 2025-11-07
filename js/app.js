// app.js - Weather API and Data Management
import { API_KEY, BASE_URL } from './config.js';

/**
 * Fetch current weather data for a city
 * @param {string} city - City name to fetch weather for
 * @returns {Promise<Object>} Weather data object
 */
export async function fetchWeather(city) {
  try {
    const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`City not found: ${city}`);
    }
    
    const data = await response.json();
    
    // Save to localStorage for offline use
    saveToLocalStorage('lastWeather', data);
    saveToLocalStorage('lastCity', city);
    
    return data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    // Try to load from cache
    const cachedData = getFromLocalStorage('lastWeather');
    if (cachedData) {
      return cachedData;
    }
    throw error;
  }
}

/**
 * Fetch 5-day weather forecast for a city
 * @param {string} city - City name to fetch forecast for
 * @returns {Promise<Object>} Forecast data object
 */
export async function fetchForecast(city) {
  try {
    const url = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Forecast not found for: ${city}`);
    }
    
    const data = await response.json();
    
    // Save to localStorage
    saveToLocalStorage('lastForecast', data);
    
    return data;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    // Try to load from cache
    const cachedData = getFromLocalStorage('lastForecast');
    if (cachedData) {
      return cachedData;
    }
    throw error;
  }
}

/**
 * Fetch weather by coordinates (for geolocation)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Weather data object
 */
export async function fetchWeatherByCoords(lat, lon) {
  try {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Weather not found for location');
    }
    
    const data = await response.json();
    saveToLocalStorage('lastWeather', data);
    
    return data;
  } catch (error) {
    console.error('Error fetching weather by coords:', error);
    throw error;
  }
}

/**
 * Fetch forecast by coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Forecast data object
 */
export async function fetchForecastByCoords(lat, lon) {
  try {
    const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Forecast not found for location');
    }
    
    const data = await response.json();
    saveToLocalStorage('lastForecast', data);
    
    return data;
  } catch (error) {
    console.error('Error fetching forecast by coords:', error);
    throw error;
  }
}

/**
 * Determine if it's day or night based on sunrise/sunset times
 * @param {Object} weatherData - Weather data with sys.sunrise and sys.sunset
 * @returns {string} 'day' or 'night'
 */
export function detectDayNight(weatherData) {
  if (!weatherData || !weatherData.sys) {
    return 'day'; // Default to day
  }
  
  const now = Math.floor(Date.now() / 1000); // Current time in Unix timestamp
  const sunrise = weatherData.sys.sunrise;
  const sunset = weatherData.sys.sunset;
  
  // Check if current time is between sunrise and sunset
  const isDay = now >= sunrise && now < sunset;
  
  return isDay ? 'day' : 'night';
}

/**
 * Format Unix timestamp to readable time
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted time string
 */
export function formatTime(timestamp) {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  
  return `${displayHours}:${minutes} ${ampm}`;
}

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {*} data - Data to store
 */
export function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

/**
 * Get data from localStorage
 * @param {string} key - Storage key
 * @returns {*} Retrieved data or null
 */
export function getFromLocalStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
}

/**
 * Add city to search history
 * @param {string} city - City name to add
 */
export function addToSearchHistory(city) {
  let history = getFromLocalStorage('searchHistory') || [];
  
  // Remove if already exists
  history = history.filter(item => item.toLowerCase() !== city.toLowerCase());
  
  // Add to beginning
  history.unshift(city);
  
  // Keep only last 5
  history = history.slice(0, 5);
  
  saveToLocalStorage('searchHistory', history);
}

/**
 * Get search history
 * @returns {Array<string>} Array of city names
 */
export function getSearchHistory() {
  return getFromLocalStorage('searchHistory') || [];
}

/**
 * Clear search history
 */
export function clearSearchHistory() {
  saveToLocalStorage('searchHistory', []);
}

/**
 * Remove single city from search history
 * @param {string} city - City name to remove
 */
export function removeFromSearchHistory(city) {
  let history = getFromLocalStorage('searchHistory') || [];
  history = history.filter(item => item.toLowerCase() !== city.toLowerCase());
  saveToLocalStorage('searchHistory', history);
}
