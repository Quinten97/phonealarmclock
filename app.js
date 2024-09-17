const API_KEY = "e37d778315a883697ac74a972265dc70"; // Replace with your actual OpenWeather API key

// Function to fetch weather data
async function fetchWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    // Extract and display the necessary data
    const temperature = data.main.temp;
    const weather = data.weather[0]; // Assuming first weather condition is primary
    const precipitation = weather.description;
    const uvIndex = await fetchUVIndex(lat, lon); // We will get UV index separately

    document.getElementById("temperature").textContent = `${temperature.toFixed(
      1
    )} °F`;
    document.getElementById("precipitation").textContent = `${precipitation}`;
    document.getElementById("uvIndex").textContent = `${uvIndex}`;

    // Update precipitation icon based on the weather condition
    updatePrecipitationIcon(weather.icon);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

// Function to fetch UV index
async function fetchUVIndex(lat, lon) {
  const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  try {
    const response = await fetch(uvUrl);
    const data = await response.json();
    return data.value;
  } catch (error) {
    console.error("Error fetching UV index:", error);
    return "--"; // return placeholder in case of error
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
  document.getElementById(
    "currentTime"
  ).textContent = `${now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

// Get user's location and call weather API
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // Fetch and display weather data
      fetchWeather(lat, lon);
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

  const apiKey = 'oKHaqU768jbwUedqzig3wuSu8pBv4kll';
  const url = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=1`; // Limit to 1 to get just one GIF


  const response = await fetch(URL).then((data) => data.json).then((data) => {
    const gifUrl = data.data[0]?.images?.original?.url;
    
    if (gifUrl) {
      // Update the src of the image element
      document.querySelector('.gif-container').src = gifUrl;
    } 
    else {
      console.error('No GIF URL found');
    }
  }) 

// Initialize the app
function init() {
  displayTime();
  getLocation();

  // Update time every second
  setInterval(displayTime, 1000);

  // Fetch weather data every 30 minutes (1800000 milliseconds)
  setInterval(() => {
    getLocation();
  }, 1800000); // 30 minutes in milliseconds
}

window.onload = init;
