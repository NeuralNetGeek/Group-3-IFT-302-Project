export function applyTheme(weatherData) {
  const body = document.body;
  const now = new Date().getTime() / 1000;
  const sunrise = weatherData.sys.sunrise;
  const sunset = weatherData.sys.sunset;

  const isDay = now > sunrise && now < sunset;
  if (isDay) {
    body.classList.remove("night-celsius");
    body.classList.add("day-celsius");
  } else {
    body.classList.remove("day-celsius");
    body.classList.add("night-celsius");
  }
}