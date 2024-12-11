document.getElementById("compare-button").addEventListener("click", async () => {
    const city1 = document.getElementById("city1").value.trim();
    const city2 = document.getElementById("city2").value.trim();
    const city3 = document.getElementById("city3").value.trim();

    if (!city1 && !city2 && !city3) {
        alert("Please enter at least one city.");
        return;
    }

    const cities = [city1, city2, city3].filter(city => city); // Filter out empty inputs

    // Fetch AQI data for all cities
    const results = await Promise.all(cities.map(fetchCityAQI));

    // Check for errors in fetching data
    if (results.some(result => result === null)) {
        alert("Failed to fetch data for one or more cities.");
        return;
    }

    // Display comparison and detailed data
    displayComparison(results);
    displayDetailedComparison(results);
});

async function fetchCityAQI(cityName) {
    try {
        const coordinates = await fetchCityCoordinatesFS(cityName); // Fetch city coordinates

        if (!coordinates) {
            throw new Error(`Failed to fetch coordinates for ${cityName}`);
        }

        const aqiData = await fetchLiveDataFS(coordinates); // Fetch AQI data

        if (!aqiData) {
            throw new Error(`Failed to fetch AQI data for ${cityName}`);
        }

        // Normalize pollutants against "good" thresholds
        const thresholds = {
            co: 1000,     // CO threshold in µg/m³
            no: 40,       // NO threshold in µg/m³
            no2: 40,      // NO2 threshold in µg/m³
            o3: 100,      // O3 threshold in µg/m³
            so2: 20,      // SO2 threshold in µg/m³
            pm25: 25,     // PM2.5 threshold in µg/m³
            pm10: 50,     // PM10 threshold in µg/m³
            nh3: 200,     // NH3 threshold in µg/m³
        };

        // Calculate normalized pollutant values
        const pollutants = {
            pm25: (aqiData.pm25 / thresholds.pm25).toFixed(2),
            pm10: (aqiData.pm10 / thresholds.pm10).toFixed(2),
            co: (aqiData.co / thresholds.co).toFixed(2),
            no: (aqiData.no / thresholds.no).toFixed(2),
            no2: (aqiData.no2 / thresholds.no2).toFixed(2),
            so2: (aqiData.so2 / thresholds.so2).toFixed(2),
            o3: (aqiData.o3 / thresholds.o3).toFixed(2),
        };

        return {
            city: cityName,
            aqi: aqiData.aqi,
            pollutants,
        };
    } catch (error) {
        console.error(error);
        return null; // Handle errors gracefully
    }
}

// Bar Chart for AQI Comparison
let barChartInstance = null;

function displayComparison(results) {
    const ctx = document.getElementById("comparisonChart").getContext("2d");

    // Destroy previous bar chart instance if it exists
    if (barChartInstance) {
        barChartInstance.destroy();
        console.log("Previous Bar Chart Destroyed");
    }

    const labels = results.map(result => result.city); // City names
    const data = results.map(result => result.aqi); // AQI values

    const chartData = {
        labels,
        datasets: [{
            label: "Air Quality Index (AQI)",
            data,
            backgroundColor: results.map(() => getRandomColor()), // Unique colors
            borderColor: results.map(() => getRandomColor()),
            borderWidth: 1,
        }],
    };

    const chartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    // Create and store the new chart instance
    barChartInstance = new Chart(ctx, {
        type: "bar",
        data: chartData,
        options: chartOptions,
    });

    console.log("New Bar Chart Created");
    document.getElementById("results").style.display = "block"; // Ensure results section is visible
}

// Line Chart for Detailed Pollutant Comparison
let lineChartInstance = null;

function displayDetailedComparison(citiesData) {
    const ctx = document.getElementById("detailedLineChart").getContext("2d");

    // Destroy the existing line chart instance if it exists
    if (lineChartInstance) {
        lineChartInstance.destroy();
        console.log("Previous Line Chart Destroyed");
    }

    const pollutants = ["pm25", "pm10", "co", "no", "no2", "so2", "o3"];
    const labels = pollutants.map(pollutant => pollutant.toUpperCase()); // Pollutant names

    // Create datasets for each city
    const datasets = citiesData.map(cityData => ({
        label: cityData.city, // City name
        data: pollutants.map(pollutant => cityData.pollutants[pollutant]), // Pollutant values
        borderColor: getRandomColor(),
        borderWidth: 2,
        fill: false,
    }));

    const chartData = {
        labels, // Pollutants on X-axis
        datasets,
    };

    const chartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    // Create and store the new chart instance
    lineChartInstance = new Chart(ctx, {
        type: "line",
        data: chartData,
        options: chartOptions,
    });

    console.log("New Line Chart Created");
}

function getRandomColor() {
    return `rgba(${Math.floor(Math.random() * 255)}, 
                 ${Math.floor(Math.random() * 255)}, 
                 ${Math.floor(Math.random() * 255)}, 1)`;
}
