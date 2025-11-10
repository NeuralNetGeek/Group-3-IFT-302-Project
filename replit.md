# Weather Dashboard

## Overview
A polished weather dashboard application built with vanilla HTML/CSS/JavaScript that displays current weather conditions, key metrics, and a 5-day forecast. Features automatic day/night theme switching and temperature unit conversion.

## Project Structure
- **Pages/** - HTML pages (index.html, history.html, location.html)
- **Style/** - CSS files for theming and styling
- **js/** - JavaScript modules for weather API, UI rendering, and app logic
- **assets/icons/** - SVG weather and UI icons
- **server.js** - Node.js HTTP server serving static files on port 5000

## Features
- Real-time weather data from OpenWeatherMap API
- Automatic day/night theme switching based on sunrise/sunset times
- Temperature conversion between Celsius and Fahrenheit
- Search functionality with location history
- Current conditions with metrics (humidity, wind, pressure, visibility)
- 5-day weather forecast with icons and temperatures
- Local storage for offline caching and user preferences

## Setup
The application uses Node.js to serve static files and inject environment variables. The workflow is configured to run on port 5000 with webview output for easy preview in Replit.

## API Configuration
The app requires an OpenWeatherMap API key stored in the `OPENWEATHER_API_KEY` environment variable. The server injects this securely into the HTML at runtime.

## Recent Changes
**November 10, 2025**
- Initial project setup in Replit environment
- Created Node.js server to serve static files on port 5000
- Configured environment variable injection for API key
- Set up workflow for automatic server restart
- Added cache-control headers to prevent stale content issues

## Architecture
- **Frontend**: Pure JavaScript with ES6 modules
- **Server**: Node.js HTTP server with environment variable injection
- **API**: OpenWeatherMap API for weather data
- **Storage**: localStorage for caching and user preferences

## User Preferences
- Default city: Abuja, Nigeria
- Temperature units stored in localStorage
- Search history limited to 5 most recent searches
