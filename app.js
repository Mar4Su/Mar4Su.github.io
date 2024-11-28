async function fetchCityCoordinates(cityName) {
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

    const latitude = data[0].lat;
    const longitude = data[0].lon;
    const foundcountry = data[0].country;
    const foundcity = data[0].name
    const foundstate = data[0].state || "N/A"; // Handle cases where state might be undefined


    return { latitude, longitude, foundcountry, foundcity, foundstate };

  } catch (error) {
    console.error("Error fetching city coordinates:", error);
    alert("City not found. Please enter a valid city name.");
    return null;
  }
}





async function fetchLiveData( {foundcountry, foundcity, foundstate, latitude, longitude }) {
  try {
    const apiKey = "04027831bf6d0fb2b52e7c423c6ab16b";
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
    );

    const secresponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
    );


    if (!response.ok) {
      throw new Error("Failed to fetch air quality data.");
    }
    if (!secresponse.ok) {
      throw new Error("Failed to fetch weather data.");
    }

    const data = await response.json();
    const secdata = await secresponse.json();
    console.log("AQ API Response:", data);
    console.log("Weather API Response:", secdata);


    const components = data.list[0]?.components || {}; // Ensure components is defined
    const aqi = data.list[0]?.main.aqi || "N/A"; // Ensure aqi is defined
    const main = secdata.main || {}; // Ensure main is defined
    const updatedAt = new Date(data.list[0]?.dt * 1000).toLocaleString() || "N/A";
    const temperatureCelsius = main.temp ? (main.temp - 273.15).toFixed(1) : "N/A";

    return {
      temperature: temperatureCelsius || "N/A",
      humidity: main.humidity || "N/A",
      aqi: aqi || "N/A",
      co: components.co || "N/A",
      no: components.no || "N/A",
      no2: components.no2 || "N/A",
      o3: components.o3 || "N/A",
      so2: components.so2 || "N/A",
      pm25: components.pm2_5 || "N/A",
      pm10: components.pm10 || "N/A",
      nh3: components.nh3 || "N/A",
      updatedAt,
    };
  } catch (error) {
    console.error("Error fetching air quality data:", error);
    alert("Failed to fetch air quality data. Please try again.");
    return null;
  }
}





async function updateDashboard(coordinates) {
  const { foundcountry, foundcity, foundstate, latitude, longitude } = coordinates;
  const data = await fetchLiveData(coordinates);

  if (!data) {
    alert("No data available for the selected location.");
    document.getElementById("loading").style.display = "none";
    return;
  }

  if (foundstate === "N/A") {
    document.getElementById("foundcity").innerText = `${foundcity}, ${foundcountry}`;
  } else {
    document.getElementById("foundcity").innerText = `${foundcity}, ${foundcountry}, ${foundstate}`;
  }

  document.getElementById("temperature").innerText = `${data.temperature} °C`;
  document.getElementById("humidity").innerText = `${data.humidity} %`;
  document.getElementById("aqi").innerText = `${data.aqi}`;
  document.getElementById("co").innerText = `${data.co} µg/m³`;
  document.getElementById("pm25").innerText = `${data.pm25} µg/m³`;
  document.getElementById("pm10").innerText = `${data.pm10} µg/m³`;
  document.getElementById("no").innerText = `${data.no} µg/m³`;
  document.getElementById("nh3").innerText = `${data.nh3} µg/m³`;
  document.getElementById("no2").innerText = `${data.no2} µg/m³`;
  document.getElementById("so2").innerText = `${data.so2} µg/m³`;
  document.getElementById("o3").innerText = `${data.o3} µg/m³`;
  document.getElementById("last-updated").innerText = `${data.updatedAt}`;

  updateCharts(data);

  document.getElementById("loading").style.display = "none";
  document.getElementById("charts").style.display = "block";
}





document.querySelector(".search-button").addEventListener("click", async () => {
  var cityName = document.getElementById("city-search").value.trim();

  if (!cityName) {
    alert("Please enter a city name.");
    return;
  }

  // Show loading state
  document.getElementById("loading").style.display = "block";
  document.getElementById("charts").style.display = "none";

  const coordinates = await fetchCityCoordinates(cityName);

  if (!coordinates) {
    return; // Handle case where city is not found
  }

  const { foundcountry, foundcity, foundstate, latitude, longitude } = coordinates;

  console.log("Country:", foundcountry);
  console.log("City:", foundcity);
  console.log("State:", foundstate);
  console.log("Latitude:", latitude);
  console.log("Longitude:", longitude);

  // Fetch air quality data and update dashboard
  await updateDashboard({ foundcountry, foundcity, foundstate, latitude, longitude });
});


let barChart, lineChart;

function updateCharts(data) {
  const pollutants = [
    data.pm25, // PM2.5
    data.pm10, // PM10
    data.no,   // Nitric Oxide
    data.nh3,  // Ammonia
    data.co,   // Carbon Monoxide
    data.so2,  // Sulfur Dioxide
    data.o3,   // Ozone
  ];

  console.log("Updating charts with pollutants:", pollutants); // Debugging

  // Update Bar Chart
  if (barChart) {
    barChart.data.datasets[0].data = pollutants; // Update data points
    barChart.update(); // Refresh the chart
  }

  // Update Line Chart
  if (lineChart) {
    lineChart.data.datasets[0].data = pollutants; // Update data points
    lineChart.update(); // Refresh the chart
  }
}



//
function initializeCharts() {
  const barChartCtx = document.getElementById("barChart").getContext("2d");
  const lineChartCtx = document.getElementById("lineChart").getContext("2d");

  // Destroy existing charts if they already exist
  if (barChart) {
    barChart.destroy();
  }

  if (lineChart) {
    lineChart.destroy();
  }

  // Initialize Bar Chart
  barChart = new Chart(barChartCtx, {
    type: "bar",
    data: {
      labels: ["PM2.5", "PM10", "NO", "NH3", "CO2", "SO2", "O3"],
      datasets: [
        {
          label: "Pollutants (µg/m³ or ppm)",
          data: [0, 0, 0, 0, 0, 0, 0], // Initial dummy data
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(201, 203, 207, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(201, 203, 207, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  // Initialize Line Chart
  lineChart = new Chart(lineChartCtx, {
    type: "line",
    data: {
      labels: ["PM2.5", "PM10", "NO", "NH3", "CO2", "SO2", "O3"],
      datasets: [
        {
          label: "Pollutants Over Time",
          data: [0, 0, 0, 0, 0, 0, 0], // Initial dummy data
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
          tension: 0.3, // Smooth line
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}



document.addEventListener("DOMContentLoaded", () => {
  initializeCharts(); // Initialize charts on page load
  console.log("Charts initialized");
});

document.getElementById("temperaturecard").addEventListener("click", () => {
  //const { latitude, longitude } = currentCoordinates; // Ensure these are globally accessible
  window.location.href = `weather.html`;
});

document.getElementById("aqicard").addEventListener("click", (cityName) => {
  window.location.href = `aqi.html`;
  
  

  document.getElementById("loading").style.display = "block";
  document.getElementById("charts").style.display = "none";

  const coordinates = fetchCityCoordinates(cityName);

  if (!coordinates) {
    return; // Handle case where city is not found
  }

  const { foundcountry, foundcity, foundstate, latitude, longitude } = coordinates;

  console.log("Country:", foundcountry);
  console.log("City:", foundcity);
  console.log("State:", foundstate);
  console.log("Latitude:", latitude);
  console.log("Longitude:", longitude);

  // Fetch air quality data and update dashboard
  updateDashboard({ foundcountry, foundcity, foundstate, latitude, longitude });


});

document.getElementById("foundcitycard").addEventListener("click", () => {
  //const { latitude, longitude } = currentCoordinates; // Ensure these are globally accessible
  window.location.href = `citymap.html`;
});

