async function updateDashboard(coordinates) {
    const { foundcountry, foundcity, foundstate, latitude, longitude } = coordinates;
    const data = await fetchLiveDataFS(coordinates);
  
    //update the data
    if (foundstate === "N/A") {
      document.getElementById("foundcity").innerText = `${foundcity}, ${foundcountry}`;
    } else {
      document.getElementById("foundcity").innerText = `${foundcity}, ${foundcountry}, ${foundstate}`;
    }
    document.getElementById("aqi").innerText = `${data.aqi}`;
    document.getElementById("temperature").innerText = `${data.temperature} °C`;
    document.getElementById("humidity").innerText = `${data.humidity} %`;
    document.getElementById("co").innerText = `${data.co} µg/m³`;
    document.getElementById("pm25").innerText = `${data.pm25} µg/m³`;
    document.getElementById("pm10").innerText = `${data.pm10} µg/m³`;
    document.getElementById("no").innerText = `${data.no} µg/m³`;
    document.getElementById("nh3").innerText = `${data.nh3} µg/m³`;
    document.getElementById("no2").innerText = `${data.no2} µg/m³`;
    document.getElementById("so2").innerText = `${data.so2} µg/m³`;
    document.getElementById("o3").innerText = `${data.o3} µg/m³`;
    document.getElementById("last-updated").innerText = `${data.updatedAt}`;

    const { barChart, lineChart } = initializeChartsFS();
    const pollutants = [
    data.pm25/10,
    data.pm10/20,
    data.no/10,
    data.nh3/12.5,
    data.co/419.3,
    data.so2/12.5,
    data.o3/35,
    ];

  // Update charts
  barChart.data.datasets[0].data = pollutants;
  barChart.update();

  lineChart.data.datasets[0].data = pollutants;
  lineChart.update();
  }

async function aqidisplay() {
    const cityName = localStorage.getItem("selectedCity");
  if (!cityName) {
    alert("City not found. Please go back and search for a city.");
    return;
  }

  // Fetch coordinates for the city
  const coordinates = await fetchCityCoordinatesFS(cityName);
  if (!coordinates) {
    alert("Failed to fetch coordinates for the selected city.");
    return;
  }

  const { foundcountry, foundcity, foundstate, latitude, longitude } = coordinates;

  console.log("Country:", foundcountry);
  console.log("City:", foundcity);
  console.log("State:", foundstate);
  console.log("Latitude:", latitude);
  console.log("Longitude:", longitude);

  // Fetch air quality data and update dashboard
  await updateDashboard({ foundcountry, foundcity, foundstate, latitude, longitude });
}

// Ensure the function runs when the page loads
document.addEventListener("DOMContentLoaded", aqidisplay);