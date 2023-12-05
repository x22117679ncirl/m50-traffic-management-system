document.addEventListener("DOMContentLoaded", function () {
  const weatherUpdateBtn = document.getElementById("weatherUpdateButton");
  const weatherTable = document.getElementById("weatherTable");
  const weatherMessage = document.getElementById("weatherMessage");
  const currentDateElem = document.getElementById("currentDate");
  const currentTimeElem = document.getElementById("currentTime");
  const temperatureElem = document.getElementById("temperature");
  const weatherElem = document.getElementById("weather");
  const airQualityIndexElem = document.getElementById("airQualityIndex");
  const airQualityMessageElem = document.getElementById("airQualityMessage");

  weatherUpdateBtn.addEventListener("click", function () {
    fetch("/api/weather")
      .then((response) => response.json())
      .then((data) => {
        // Display the fetched data. The client is fetching it from the server.
        currentDateElem.textContent = data.date;
        currentTimeElem.textContent = data.time;
        temperatureElem.textContent = `${data.temperature}°C`;
        weatherElem.textContent = data.weather;
        weatherMessage.innerHTML = `<strong>M50 message:</strong> ${data.message}`;

        // Fetch and display air quality data.
        return fetch("/api/air-quality");
      })
      .then((response) => response.json())
      .then((airQualityData) => {
        airQualityIndexElem.textContent = airQualityData.quality;
        airQualityMessageElem.textContent = airQualityData.message;
      })
      .catch((error) => {
        console.error("Error fetching air quality data:", error);
      });

    weatherTable.style.display = "block"; // Show the table that is initially hidden before the interaction
  });
});