// Fetch city coordinates using OpenWeatherMap Geocoding API
// Returns lat, lon, country, city, state
async function fetchCityCoordinatesFS(cityName) {
    if (!cityName) {
      alert("City name is empty. Please enter a valid city.");
      return null;
    }
  
    try {
      const apiKey = "04027831bf6d0fb2b52e7c423c6ab16b";
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`
      );
  
      if (!response.ok) {
        throw new Error("Failed to fetch city coordinates.");
      }
  
      const data = await response.json();
  
      if (data.length === 0) {
        throw new Error("City not found.");
      }
  
      return {
        latitude: data[0].lat,
        longitude: data[0].lon,
        foundcountry: data[0].country,
        foundcity: data[0].name,
        foundstate: data[0].state || "N/A", // Handle undefined state
      };
    } catch (error) {
      console.error("Error fetching city coordinates:", error);
      alert(error.message);
      return null;
    }
  }



  

// Fetch AQI and weather data for the given coordinates
// Returns AQI DATA
async function fetchLiveDataFS({ latitude, longitude }) {
    try {
      const apiKey = "04027831bf6d0fb2b52e7c423c6ab16b";
  
      const airQualityResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
      );
  
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
      );
  
      if (!airQualityResponse.ok || !weatherResponse.ok) {
        throw new Error("Failed to fetch data.");
      }
  
      const airQualityData = await airQualityResponse.json();
      const weatherData = await weatherResponse.json();
  
      const components = airQualityData.list[0]?.components || {};
      const aqi = airQualityData.list[0]?.main.aqi || "N/A";
      const main = weatherData.main || {};
      const temperatureCelsius = main.temp ? (main.temp - 273.15).toFixed(1) : "N/A";
  
      return {
        temperature: temperatureCelsius,
        humidity: main.humidity || "N/A",
        aqi,
        co: components.co || "N/A",
        no: components.no || "N/A",
        no2: components.no2 || "N/A",
        o3: components.o3 || "N/A",
        so2: components.so2 || "N/A",
        pm25: components.pm2_5 || "N/A",
        pm10: components.pm10 || "N/A",
        nh3: components.nh3 || "N/A",
        updatedAt: new Date(airQualityData.list[0]?.dt * 1000).toLocaleString(),
      };
    } catch (error) {
      console.error("Error fetching air quality data:", error);
      alert("Failed to fetch air quality data. Please try again.");
      return null;
    }
  }





// Initialize charts (Bar and Line)
// Returns Barchart and Linechart
function initializeChartsFS() {
    const barChartCanvas = document.getElementById("barChart");
    const lineChartCanvas = document.getElementById("lineChart");
  
    if (!barChartCanvas || !lineChartCanvas) {
      console.warn("Chart elements not found on this page. Skipping chart initialization.");
      return;
    }
  
    const barChartCtx = barChartCanvas.getContext("2d");
    const lineChartCtx = lineChartCanvas.getContext("2d");
  
    return {
      barChart: new Chart(barChartCtx, {
        type: "bar",
        data: {
          labels: ["PM2.5", "PM10", "NO", "NH3", "CO2", "SO2", "O3"],
          datasets: [
            {
              label: "Pollutants (µg/m³ or ppm)",
              data: [0, 0, 0, 0, 0, 0, 0],
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: { beginAtZero: true },
          },
        },
      }),
      lineChart: new Chart(lineChartCtx, {
        type: "line",
        data: {
          labels: ["PM2.5", "PM10", "NO", "NH3", "CO2", "SO2", "O3"],
          datasets: [
            {
              label: "Pollutants Over Time",
              data: [0, 0, 0, 0, 0, 0, 0],
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
              tension: 0.3,
            },
          ],
        },
        options: {
          scales: {
            y: { beginAtZero: true },
          },
        },
      }),
    };
  }