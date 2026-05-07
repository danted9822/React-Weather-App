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
* [x] **Geolocation:** Detect user location automatically on load.
* [x] **Use My Location Button:** Manual geolocation refresh from the search area.
* [x] **Favorites:** Save frequently searched cities using LocalStorage.
* [x] **Smart Search:** Autocomplete dropdown with keyboard navigation.
* [x] **Recent Searches:** Keep and suggest latest searched cities.
* [x] **Error Handling:** Inline UI feedback for invalid cities or network errors.
* [x] **Units:** Toggle between Celsius and Fahrenheit.
* [x] **Forecast:** Display 5-day weather forecast cards with min/max and icons.
* [x] **UI Motion:** Subtle dropdown and weather panel animations.
* [ ] **Next Ideas:** Forecast detail expansion (hourly breakdown per day), richer weather icons/themes, and stronger mobile fine-tuning.

---
*Developed by Péter Halász.*
