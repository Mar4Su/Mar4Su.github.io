

//it updates the card with using fetchLivedata and save results
//calls fetchLiveDataFS(coordinates) init in const data
async function updateDashboard(coordinates) {
  const { foundcountry, foundcity, foundstate, latitude, longitude } = coordinates;
  const data = await fetchLiveDataFS(coordinates);

  //update the data
  if (foundstate === "N/A") {
    document.getElementById("foundcity").innerText = `${foundcity}, ${foundcountry}`;
  } else {
    document.getElementById("foundcity").innerText = `${foundcity}, ${foundcountry}, ${foundstate}`;
  }
  document.getElementById("temperature").innerText = `${data.temperature} °C`;
  //document.getElementById("humidity").innerText = `${data.humidity} %`;
  document.getElementById("aqi").innerText = `${data.aqi}`;
  //document.getElementById("co").innerText = `${data.co} µg/m³`;
  //document.getElementById("pm25").innerText = `${data.pm25} µg/m³`;
  //document.getElementById("pm10").innerText = `${data.pm10} µg/m³`;
  //document.getElementById("no").innerText = `${data.no} µg/m³`;
  //document.getElementById("nh3").innerText = `${data.nh3} µg/m³`;
  //document.getElementById("no2").innerText = `${data.no2} µg/m³`;
  //document.getElementById("so2").innerText = `${data.so2} µg/m³`;
  //document.getElementById("o3").innerText = `${data.o3} µg/m³`;
  //document.getElementById("last-updated").innerText = `${data.updatedAt}`;

}



//chart init
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
  } else {
    console.warn("Bar chart is not initialized.");
  }

  // Update Line Chart
  if (lineChart) {
    lineChart.data.datasets[0].data = pollutants; // Update data points
    lineChart.update(); // Refresh the chart
  } else {
    console.warn("Line chart is not initialized.");
    document.getElementById("charts").style.display = "block"; // Show charts
  }
}

document.addEventListener("DOMContentLoaded", () => {
  //initializeChartsFS(); // Initialize charts on page load
  //console.log("Charts initialized");
});




document.querySelector(".search-button").addEventListener("click", async () => {
  const cityName = document.getElementById("city-search").value.trim();

  if (!cityName) {
    alert("Please enter a city name.");
    return;
  }

  localStorage.setItem("selectedCity", cityName);

  const coordinates = await fetchCityCoordinatesFS(cityName);

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


//Switch to Weather.html & init
document.getElementById("temperaturecard").addEventListener("click", () => {
  const cityName = localStorage.getItem("selectedCity");
  if (!cityName) {
    alert("Please search for a city first.");
    return;
  }

  window.location.href = `weather.html`;
});


//Switch to aqi.html & init
document.getElementById("aqicard").addEventListener("click", () => {
  const cityName = localStorage.getItem("selectedCity");
  if (!cityName) {
    alert("Please search for a city first.");
    return;
  }

  // Navigate to aqi.html
  window.location.href = `aqi.html`;
});



//Switch to citymap.html & init
document.getElementById("foundcitycard").addEventListener("click", () => {
  const cityName = localStorage.getItem("selectedCity");
  if (!cityName) {
    alert("Please search for a city first.");
    return;
  }
  window.location.href = `citymap.html`;
});

