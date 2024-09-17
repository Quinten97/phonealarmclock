const WEATHER_API_KEY = "e37d778315a883697ac74a972265dc70"; // OpenWeather API Key
const GIPHY_API_KEY = "oKHaqU768jbwUedqzig3wuSu8pBv4kll"; // Giphy API Key

// Function to fetch weather data
async function fetchWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      // Extract and display the necessary data
      const temperature = data.main.temp;
      const weather = data.weather[0]; // Assuming first weather condition is primary
      const precipitation = weather.description;
      const uvIndex = await fetchUVIndex(lat, lon); // Get UV index separately

      document.getElementById(
        "temperature"
      ).textContent = `${temperature.toFixed(1)} °F`;
      document.getElementById("precipitation").textContent = `${precipitation}`;
      document.getElementById("uvIndex").textContent = `${uvIndex}`;

      // Update precipitation icon based on the weather condition
      updatePrecipitationIcon(weather.icon);
    } else {
      console.error("Failed to fetch weather data:", data.message);
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

// Function to fetch UV index
async function fetchUVIndex(lat, lon) {
  const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`;
  try {
    const response = await fetch(uvUrl);
    const data = await response.json();
    return data.value || "--"; // Fallback if UV index is unavailable
  } catch (error) {
    console.error("Error fetching UV index:", error);
    return "--"; // Placeholder in case of error
  }
}

// Function to update the precipitation icon
function updatePrecipitationIcon(iconCode) {
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  document.querySelector("#precipitation-container img").src = iconUrl;
}

// Function to display current time
function displayTime() {
  const now = new Date();
  document.getElementById("currentTime").textContent = now.toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

// Get user's location and call weather API
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // Fetch and display weather data
      fetchWeather(lat, lon);
    }, handleLocationError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// Handle location fetch errors
function handleLocationError(error) {
  console.error("Error fetching location:", error);
  document.getElementById("temperature").textContent = "Location unavailable";
}

// Fetch a trending GIF
function fetchTrendingGif() {
  const gifUrl = `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=1`;

  fetch(gifUrl)
    .then((response) => response.json())
    .then((data) => {
      const gif = data.data[0]?.images?.original?.url;
      document.querySelector(".gif-container").src = gif;
    })
    .catch((error) => console.error("Error fetching the GIF:", error));
}

// Initialize the app
function init() {
  displayTime();
  getLocation();
  fetchTrendingGif();

  // Update time every second
  setInterval(displayTime, 1000);

  // Fetch weather data every 30 minutes (1800000 milliseconds)
  setInterval(getLocation, 1800000); // 30 minutes in milliseconds
}

window.onload = init;
