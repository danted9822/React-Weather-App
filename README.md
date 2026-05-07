# Weather App

A lightweight, responsive weather application built with React, consuming data from the OpenWeatherMap API.

## Features
* **Current Weather:** Real-time temperature and weather conditions for searched cities.
* **Responsive Design:** Optimized for different screen sizes.
* **Dynamic Backgrounds:** Background shifts based on weather conditions (sunny, rainy, cloudy, etc.).
* **Detailed Metrics:** Shows humidity, wind speed, pressure, and temperature range.

## Technologies
* React.js
* OpenWeatherMap API
* CSS3 (Vanilla)

## Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) installed
* An [OpenWeatherMap API Key](https://home.openweathermap.org/)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/danted9822/Weather-App-React.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup Environment Variables:
   Create a `.env` file in the root directory and add your API key:
   ```text
   REACT_APP_WEATHER_API_KEY=your_api_key_here
   ```
4. Start the application:
   ```bash
   npm start
   ```

## Future Roadmap
* [ ] **Geolocation:** Detect user location automatically on load.
* [ ] **Favorites:** Save frequently searched cities using LocalStorage.
* [ ] **Error Handling:** Improve UI feedback for invalid cities or network errors.
* [ ] **Units:** Add a toggle for Celsius and Fahrenheit.
* [ ] **Forecast:** Display 5-day/3-hour weather forecasts.

---
*Developed by Péter Halász.*
