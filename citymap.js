// AQI to color mapping
function getAQIColor(aqi) {
    if (aqi === 1) return "#00e400"; // Good
    if (aqi === 2) return "#ffff00"; // Moderate
    if (aqi === 3) return "#ff7e00"; // Unhealthy for Sensitive Groups
    if (aqi === 4) return "#ff0000"; // Unhealthy
    if (aqi === 5) return "#8f3f97"; // Very Unhealthy
    return "#7e0023"; // Hazardous
  }
  
  async function init() {
    await customElements.whenDefined("gmp-map");
  
    const map = document.querySelector("gmp-map");
    const marker = document.querySelector("gmp-advanced-marker");
    const placePicker = document.querySelector("gmpx-place-picker");
    const infowindow = new google.maps.InfoWindow();
  
    // Set map options
    map.innerMap.setOptions({
        mapTypeControl: false,
    });
  
    // Fetch city coordinates from local storage
    const cityName = localStorage.getItem("selectedCity");
    if (!cityName) {
        alert("City not found. Please return to the homepage and search for a city.");
        return;
    }
  
    const coordinates = await fetchCityCoordinatesFS(cityName);
    const { latitude, longitude } = coordinates;
  
    // Fetch AQI data
    const aqiData = await fetchLiveDataFS(coordinates);
    if (!aqiData) {
        alert("Failed to fetch AQI data.");
        return;
    }
  
    const aqi = aqiData.aqi;
  
    // Center the map on the city's coordinates
    map.center = { lat: latitude, lng: longitude };
  
    // Add a marker with AQI color
    marker.position = { lat: latitude, lng: longitude };
    marker.icon = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: getAQIColor(aqi),
        fillOpacity: 0.8,
        scale: 10,
        strokeColor: "#000",
        strokeWeight: 1,
    };
  
    // Add an info window with AQI details
    infowindow.setContent(`
        <div>
            <strong>${cityName}</strong><br>
            AQI: ${aqi}<br>
            Temperature: ${aqiData.temperature || "N/A"}
        </div>
        `);
    infowindow.open(map.innerMap, marker);
  
    // Enable dynamic place selection
    placePicker.addEventListener("gmpx-placechange", async () => {
        const place = placePicker.value;
            
        if (!place.location) {
            alert("No details available for the selected location.");
            infowindow.close();
            marker.position = null;
            return;
        }
        console.log("DNAME:", place.displayName);
        const coordinate = await fetchCityCoordinatesFS(place.displayName);
        const { latitude, longitude } = coordinate;
  
    // Fetch AQI data
        const aqiData = await fetchLiveDataFS(coordinate);
        if (!aqiData) {
            alert("Failed to fetch AQI data.");
        return;
    }
  
    const aqi = aqiData.aqi;
    
        // Center map and move marker to the selected place
        map.center = place.location;
        marker.position = place.location;
    
        infowindow.setContent(`
            <strong>${place.displayName}</strong><br>
            <span>${place.formattedAddress}</span><br>
            AQI: ${aqi}<br>
            Temperature: ${aqiData.temperature || "N/A"}
        `);
        infowindow.open(map.innerMap, marker);
    });
  }
  
  // Initialize the map on DOM content load
  document.addEventListener("DOMContentLoaded", init);