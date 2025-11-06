export function renderWeather(data) {
  const city = document.getElementById("city");
  const temp = document.getElementById("temperature");
  const desc = document.getElementById("condition");
  const icon = document.getElementById("weather-icon");

  if (city) city.textContent = `${data.name}, ${data.sys.country}`;
  if (temp) temp.textContent = `${Math.round(data.main.temp)}°C`;
  if (desc) desc.textContent = data.weather[0].description;
  if (icon)
    icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  // Optional metrics
  setText("humidity", `${data.main.humidity}%`);
  setText("pressure", `${data.main.pressure} hPa`);
  setText("wind", `${data.wind.speed} m/s`);
  setText("visibility", `${(data.visibility / 1000).toFixed(1)} km`);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

export function renderForecast(forecast) {
  const container = document.getElementById("forecast");
  if (!container) return;
  container.innerHTML = "";

  const nextDays = forecast.list.filter((_, i) => i % 8 === 0).slice(0, 5);
  nextDays.forEach((day) => {
    const date = new Date(day.dt_txt);
    const card = document.createElement("div");
    card.className = "metric-card fade-in";
    card.innerHTML = `
      <h4>${date.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      })}</h4>
      <img src="https://openweathermap.org/img/wn/${
        day.weather[0].icon
      }.png" alt="${day.weather[0].description}" />
      <p>${Math.round(day.main.temp_max)}° / ${Math.round(
      day.main.temp_min
    )}°</p>
      <small>${day.weather[0].description}</small>
    `;
    container.appendChild(card);
  });
}