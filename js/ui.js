export function renderWeather(current) {
  document.getElementById("cityName").textContent = current.name;
  document.getElementById("temperature").textContent = Math.round(current.main.temp);
  document.getElementById("feelsLike").textContent = Math.round(current.main.feels_like);
  document.getElementById("humidity").textContent = current.main.humidity;
  document.getElementById("pressure").textContent = current.main.pressure;
  document.getElementById("windSpeed").textContent = current.wind.speed.toFixed(1);
  document.getElementById("weatherDescription").textContent = current.weather[0].description;
  document.getElementById("sidebarCondition").textContent = current.weather[0].main;
  document.getElementById("updatedTime").textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function renderForecast(forecast) {
  const container = document.getElementById("forecast");
  container.innerHTML = "";
  const daily = forecast.list.filter((_, i) => i % 8 === 0).slice(0, 5);
  daily.forEach(day => {
    const date = new Date(day.dt_txt);
    const card = document.createElement("div");
    card.className = "forecast-card frosted";
    card.innerHTML = `
      <h3>${date.toLocaleDateString('en-US', { weekday: 'short' })}</h3>
      <p>${Math.round(day.main.temp_max)}° / ${Math.round(day.main.temp_min)}°</p>
      <small>${day.weather[0].description}</small>
    `;
    container.appendChild(card);
  });
}

export function setupToggle() {
  const cBtn = document.getElementById("celsiusBtn");
  const fBtn = document.getElementById("fahrenheitBtn");

  cBtn.addEventListener("click", () => {
    document.getElementById("temperature").textContent += "";
    cBtn.classList.add("active");
    fBtn.classList.remove("active");
  });

  fBtn.addEventListener("click", () => {
    const temp = document.getElementById("temperature");
    const val = parseFloat(temp.textContent);
    temp.textContent = Math.round((val * 9) / 5 + 32);
    fBtn.classList.add("active");
    cBtn.classList.remove("active");
  });
}
