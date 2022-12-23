import './App.css';
import React, { useEffect } from 'react';

const api = {
  key: "YOUR_API_KEY",
  url: "https://api.openweathermap.org/data/2.5/"
}

function App() {

  useEffect(() => {
    document.title = "hpeter-weather-app";
  }, []);

  const [query, setQuery] = React.useState('');
  const [weather, setWeather] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query) {
      fetch(`${api.url}weather?q=${query}&units=metric&appid=${api.key}`)
        .then(resp => resp.json())
        .then(result => { setWeather(result); setQuery(''); console.log(result) });
    } else if (!query) {
      snackBar();

    }
  }
  function snackBar() {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
  }

  function dateFunction(d) {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day}, ${date} ${month} ${year}`;
  }


  const setBG = () => {
    if (typeof weather.main == "undefined") return "app";
    else if (weather.weather[0].main === 'Rain') return "app rain";
    else if (weather.weather[0].main === "Clear") return "app sunny";
    else if (weather.weather[0].main === "Clouds") return "app cloud";
    else if (weather.weather[0].main === "Mist") return "app mist";
    else if (weather.weather[0].main === "Fog") return "app mist";
    else return "app cold";
  }




  return (
    <div className={setBG()}>
      <main>
        <div className="search-bar">
          <input className="search-box" type="text" placeholder="Search city ..."
            onChange={(e) => setQuery(e.target.value)} value={query}>
          </input>
          <button type="submit" className="search-btn" onClick={handleSearch}>
            <img src="https://img.icons8.com/ios-filled/50/000000/search--v2.png" alt="" />
          </button>
        </div>

        {(typeof weather.main != "undefined") ? (
          <div>
            <div className="location-box">
              <h2 className="location">{weather.name}, {weather.sys.country}</h2>
              <p className="date">{dateFunction(new Date())}</p>
              <div className="temp">{weather.main.temp}°C</div>
              <p className="type">{weather.weather[0].main}</p>
              <div className="other-dets">
                <h4 style={{ fontSize: "30px", fontWeight: "100", marginBottom: "30px" }}>Other details :</h4>
                <p className="others">Temp Range: {Math.round(weather.main.temp_min)}°C / {Math.round(weather.main.temp_max)}°C</p>
                <p className="others">Pressure: {weather.main.pressure} hPa</p>
                <p className="others">Humidity: {weather.main.humidity} %</p>
                <p className="others">Wind speed: {weather.wind.speed} m/s</p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="welcome-box">
              <h2 className="app-name">Weather App</h2>
              <p className="comps">
                With React.js<br />
                22th September, 2022<br />
                By Péter Halász
              </p>
              <div className="welcome-text">
                <h1>welcome</h1>
                <p>
                  Weather updates for arround 200,000 cities
                </p>
              </div>
            </div>

          </div>
        )}
        <div id="snackbar">Error: add a city name</div>
      </main>
    </div>
  )
}

export default App;
