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

  function process24HourlyForecast(forecastData) {
    const forecasts = forecastData.list;
  
    // Group forecasts by day (adjusted to Korea Standard Time)
    const dailyData = {};
    forecasts.forEach((item) => {
      // Convert UTC to KST
      const localDate = new Date((item.dt + 9 * 3600) * 1000); // Add 9 hours in seconds
      const dateString = localDate.toISOString().split("T")[0]; // Extract date in YYYY-MM-DD format
  
      if (!dailyData[dateString]) {
        dailyData[dateString] = [];
      }
      dailyData[dateString].push(item);
    });
  
    // Calculate averages for each day
    const processedData = Object.keys(dailyData).map((date) => {
      const dayForecasts = dailyData[date];
      let totalTemp = 0;
      let totalFeelsLike = 0;
      let totalHumidity = 0;
      const weatherConditions = {};
  
      dayForecasts.forEach((forecast) => {
        totalTemp += forecast.main.temp;
        totalFeelsLike += forecast.main.feels_like;
        totalHumidity += forecast.main.humidity;
  
        const condition = forecast.weather[0].description;
        weatherConditions[condition] = (weatherConditions[condition] || 0) + 1;
      });
  
      const avgTemp = (totalTemp / dayForecasts.length - 273.15).toFixed(1); // Convert to Celsius
      const avgFeelsLike = (totalFeelsLike / dayForecasts.length - 273.15).toFixed(1); // Convert to Celsius
      const avgHumidity = (totalHumidity / dayForecasts.length).toFixed(0);
  
      // Determine the most frequent weather condition
      const mostFrequentCondition = Object.keys(weatherConditions).reduce((a, b) =>
        weatherConditions[a] > weatherConditions[b] ? a : b
      );
  
      return {
        date, // This is now in KST
        avgTemp,
        avgFeelsLike,
        avgHumidity,
        condition: mostFrequentCondition,
        baseData: dayForecasts, // Store base 3-hourly data
      };
    });
  
    return processedData;
  }
  
  
  // Display the 24-hourly forecast
  function display24HourlyForecast(dailyForecasts) {
    const forecastContainer = document.querySelector(".about-content");
  
    // Clear existing content
    forecastContainer.innerHTML = "";
  
    // Display each daily summary
    dailyForecasts.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "weather-card";
      card.setAttribute("data-index", index); // Attach index for easy retrieval
      card.innerHTML = `
        <h3>${new Date(item.date).toDateString()}</h3>
        <p>Average Temperature: ${item.avgTemp} °C</p>
        <p>Feels Like: ${item.avgFeelsLike} °C</p>
        <p>Condition: ${item.condition}</p>
        <p>Humidity: ${item.avgHumidity}%</p>
      `;
      forecastContainer.appendChild(card);
  
      // Add click event to display detailed 3-hourly data
      card.addEventListener("click", () => displayBaseData(item.baseData, item.date));
    });
  }
  
  // Display base 3-hourly data for a specific day
  function displayBaseData(baseData, date) {
    const forecastContainer = document.querySelector(".about-content");
  
    // Clear existing content
    forecastContainer.innerHTML = `<h2>3-Hourly Data for ${new Date(date).toDateString()}</h2>`;
  
    // Add "Back" button
    const backButton = document.createElement("button");
    backButton.className = "back-button";
    backButton.textContent = "Back to 24-Hourly Data";
    forecastContainer.appendChild(backButton);
  
    // Add event listener to go back
    backButton.addEventListener("click", () => {
      const cityName = localStorage.getItem("selectedCity");
      if (cityName) {
        // Fetch the forecast again and display 24-hourly data
        fetchWeatherForecast(cityName).then((forecastData) => {
          if (forecastData) {
            const dailyForecasts = process24HourlyForecast(forecastData);
            display24HourlyForecast(dailyForecasts);
          }
        });
      }
    });
  
    // Display the 3-hourly data
    baseData.forEach((item) => {
      const time = new Date(item.dt * 1000).toLocaleTimeString();
      const temperatureCelsius = (item.main.temp - 273.15).toFixed(1);
      const feelsLikeCelsius = (item.main.feels_like - 273.15).toFixed(1);
      const description = item.weather[0].description;
      const humidity = item.main.humidity;
  
      const card = document.createElement("div");
      card.className = "weather-card";
      card.innerHTML = `
        <h3>${time}</h3>
        <p>Temperature: ${temperatureCelsius} °C</p>
        <p>Feels Like: ${feelsLikeCelsius} °C</p>
        <p>Condition: ${description}</p>
        <p>Humidity: ${humidity}%</p>
      `;
      forecastContainer.appendChild(card);
    });
  }
  
  
  // On page load, fetch and display 24-hourly weather data
  document.addEventListener("DOMContentLoaded", async () => {
    const cityName = localStorage.getItem("selectedCity");
  
    if (!cityName) {
      alert("City not found. Please return to the homepage and search for a city.");
      return;
    }
  
    const forecastData = await fetchWeatherForecast(cityName);
  
    if (!forecastData) {
      return;
    }
  
    const dailyForecasts = process24HourlyForecast(forecastData);
    display24HourlyForecast(dailyForecasts);
  });