## Weather Dashboard

This project is a polished weather dashboard built with vanilla HTML/CSS/JS. It shows current weather, key metrics, and a 5‑day forecast with day/night themes and streamlined SVG iconography.

### Features
- Automatic day/night theme switching based on local time
- Temperature conversion between °C and °F (persists via localStorage)
- Search with location history and separate History/Location pages
- Current conditions, metrics (humidity, wind, pressure, visibility)
- 5‑day forecast with icons and high/low temps
- Local SVG icons with logical mappings under `assets/icons/`

### Structure
- `index.html` – main dashboard
- `Pages/` – additional views (`history.html`, `location.html`, `night.html`)
- `Style/` – `shared.css`, `day.css`, `night.css`
- `js/` – `script.js`, `ui.js`, `app.js`, `config.js`, `mockAPI.js`
- `assets/icons/` – weather icons and `assets/icons/sidebar/` for sidebar icons

### Icon Mapping
- Current/forecast conditions use OpenWeather icon codes mapped to local SVGs in `js/ui.js`.
- Sidebar icons: `cloud.svg` (Condition), `clock.svg` (Local Time), `pin.svg` (Current Location)
- Additional metric icons: `droplet.svg`, `wind.svg`, `gauge.svg`, `eye.svg`

### Recent Improvements
- Perfect vertical alignment for metric cards (numbers + units)
- Replaced drawn shapes with cohesive SVG icons
- Corrected forecast temperature order (e.g., `24°C` not `°C24`)
- Sidebar condition text wraps cleanly without awkward breaks
- Added icons beside “Weather Dashboard” and city display

### How to Run
Open `index.html` directly, or serve with any static server.

### Notes
- All styling changes are minimal and respect the original Figma layout (spacing, colors, radii).
- Data binding and API fetch logic remain untouched, only presentation improved.

### Checklist Verification
- Day/Night theme: automatic switch confirmed
- Temperature conversion: toggles and updates all relevant UI text
- Search/History/Location: linked and functional
- API updates: current and forecast values populate correctly
- Local storage: unit preference and history persist; clearing works
- Icons: render across metrics, conditions, forecast, and sidebar
- Layout: holds on typical laptop/tablet widths


