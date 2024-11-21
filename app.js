async function fetchLiveData(location) {
  try {
    const apiKey = "04027831bf6d0fb2b52e7c423c6ab16b";
    const coordinates = {
      seoul: { latitude: 37.5665, longitude: 126.9780 },
      busan: { latitude: 35.1796, longitude: 129.0756 },
      daegu: { latitude: 35.8722, longitude: 128.6014 },
      ub: { latitude: 47.9221, longitude: 106.9155 },
    };

    const cityCoordinates = coordinates[location.toLowerCase()];
    if (!cityCoordinates) {
      throw new Error(`Coordinates not found for location: ${location}`);
    }

    
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${cityCoordinates.latitude}&lon=${cityCoordinates.longitude}&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data for ${location}`);
    }

    const data = await response.json();
    console.log("API Response:", data);

    // Map the API response to dashboard fields
    const components = data.list[0].components; // Air quality components
    const aqi = data.list[0].main.aqi; // Air Quality Index (1-5 scale)
    const updatedAt = new Date(data.list[0].dt * 1000); // Convert Unix timestamp to Date

    return {
      aqi: aqi || "N/A",
      co: components.co || "N/A", // Carbon Monoxide
      no: components.no || "N/A", // Nitric Oxide
      no2: components.no2 || "N/A", // Nitrogen Dioxide
      o3: components.o3 || "N/A", // Ozone
      so2: components.so2 || "N/A", // Sulfur Dioxide
      pm25: components.pm2_5 || "N/A", // PM2.5
      pm10: components.pm10 || "N/A", // PM10
      nh3: components.nh3 || "N/A", // Ammonia
      updatedAt: updatedAt.toLocaleString(),
    };
  } catch (error) {
    console.error("Error fetching live data:", error);
    alert(`Failed to fetch data for ${location}. Please try again.`);
    return null;
  }
}



async function updateDashboard(location) {
  const data = await fetchLiveData(location);

  if (!data) {
    return;
  }

  // Update the dashboard fields
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

  console.log(`Live data for ${location}:`, data);

  updateCharts(data);
  // Hide loading and display data
  document.getElementById("loading").style.display = "none";
  document.getElementById("charts").style.display = "block";
}



document.querySelector(".update-button").addEventListener("click", () => {
  const location = document.getElementById("station").value;

  // Show loading state
  document.getElementById("loading").style.display = "block";
  document.getElementById("charts").style.display = "none";

  updateDashboard(location); // Call updateDashboard with the selected city
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
