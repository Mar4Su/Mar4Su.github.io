

async function fetchWeatherForecast(cityName) {
    try {
      const apiKey = "04027831bf6d0fb2b52e7c423c6ab16b"; // Replace with your OpenWeather API key
  
      // Fetch coordinates for the city
      const coordinates = await fetchCityCoordinatesFS(cityName);
      if (!coordinates) {
        throw new Error("Failed to fetch coordinates.");
      }
      const { foundcountry, foundcity, foundstate, latitude, longitude } = coordinates;
  
      // Fetch weather forecast data
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch weather forecast.");
      }
  
      const forecastData = await response.json();
      return forecastData;
    } catch (error) {
      console.error("Error fetching weather forecast:", error);
      alert("Failed to fetch weather forecast. Please try again.");
      return null;
    }
  }

  function displayWeatherForecast(forecastData) {
    // Find the container for the weather cards
    const forecastContainer = document.querySelector(".about-content");
  
    // Clear existing content
    forecastContainer.innerHTML = "";
  
    // Process each forecast in 3-hour intervals
    forecastData.list.forEach((item) => {
      const date = new Date(item.dt * 1000); // Convert UNIX timestamp to JS Date
      const temperatureCelsius = (item.main.temp - 273.15).toFixed(1); // Convert Kelvin to Celsius
      const feelsTempCelsius = (item.main.feels_like - 273.15).toFixed(1); // Convert Kelvin to Celsius
      const description = item.weather[0].description; // Weather description
      const icon = item.weather[0].icon; // Icon for weather condition
  
      // Create a card for each forecast
      const card = document.createElement("div");
      card.className = "weather-card";
      card.innerHTML = `
        <h3>${date.toLocaleString()}</h3>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}">
        <p>Temperature: ${temperatureCelsius} °C</p>
        <p>Feels Like: ${feelsTempCelsius} °C</p>
        <p>Condition: ${description}</p>
      `;
  
      // Add the card to the container
      forecastContainer.appendChild(card);
    });
  }



async function weatherdisplay() {
    const cityName = localStorage.getItem("selectedCity");
    if (!cityName) {
      alert("City not found. Please go back to the homepage and search for a city.");
      return;
    }

    const weatherData = await fetchWeatherForecast(cityName);
    displayWeatherForecast(weatherData);
  }


document.addEventListener("DOMContentLoaded", weatherdisplay);