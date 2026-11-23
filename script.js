
const CITY_URL = "https://geocoding-api.open-meteo.com/v1/search?count=1&name=";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast?current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code";


const cityInput = document.getElementById("city");
const searchButton = document.getElementById("btn");
const message = document.getElementById("status");
const card = document.getElementById("card");


const showMessage = (text) => {
  message.textContent = text;
  card.hidden = true;
};

const getCondition = (code) => {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Fog";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Rain showers";
  return "Thunderstorm";
};


const findCity = (cityName, callback) => {
  fetch(CITY_URL + encodeURIComponent(cityName))
    .then((response) => response.json())
    .then((data) => callback(data.results)) 
    .catch(() => showMessage("Network error. Check your internet."));
};


const getWeather = (latitude, longitude, callback) => {
  const url = WEATHER_URL + "&latitude=" + latitude + "&longitude=" + longitude;

  fetch(url)
    .then((response) => response.json())
    .then((data) => callback(data.current))
    .catch(() => showMessage("Network error. Check your internet."));
};


const showWeather = (city, weather) => {
  document.getElementById("name").textContent = city.name;
  document.getElementById("country").textContent = city.country;
  document.getElementById("temp").textContent = weather.temperature_2m + "°C";
  document.getElementById("condition").textContent = getCondition(weather.weather_code);
  document.getElementById("humidity").textContent = "Humidity: " + weather.relative_humidity_2m + "%";
  document.getElementById("wind").textContent = "Wind: " + weather.wind_speed_10m + " km/h";

  message.textContent = "";
  card.hidden = false;
};


const searchCity = () => {
  const cityName = cityInput.value.trim();

  if (cityName === "") {
    showMessage("Please type a city name.");
    return;
  }

  showMessage("Loading...");

  
  findCity(cityName, (results) => {
    if (!results) {
      showMessage("City not found.");
      return;
    }

    const city = results[0];

   
    getWeather(city.latitude, city.longitude, (weather) => {
    
      showWeather(city, weather);
    });
  });
};


searchButton.addEventListener("click", searchCity);

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchCity();
  }
});


searchCity();