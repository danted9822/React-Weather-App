import './App.css';
import React, { useEffect } from 'react';

const api = {
  key: process.env.REACT_APP_WEATHER_API_KEY,
  url: 'https://api.openweathermap.org/data/2.5/'
};

function App() {
  const DEGREE = '\u00B0';
  const STAR_FILLED = '\u2605';
  const STAR_OUTLINE = '\u2606';

  const [query, setQuery] = React.useState('');
  const [weather, setWeather] = React.useState('');
  const [forecast, setForecast] = React.useState([]);
  const [favorites, setFavorites] = React.useState(JSON.parse(localStorage.getItem('weather-favorites')) || []);
  const [recentSearches, setRecentSearches] = React.useState(JSON.parse(localStorage.getItem('weather-recent-searches')) || []);
  const [filteredCities, setFilteredCities] = React.useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [unit, setUnit] = React.useState('metric');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLocating, setIsLocating] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const allSuggestedCities = React.useMemo(() => {
    const popularCities = [
      'Budapest', 'London', 'New York', 'Tokyo', 'Berlin', 'Paris', 'Rome', 'Madrid',
      'Vienna', 'Prague', 'Amsterdam', 'Barcelona', 'Dubai', 'Sydney', 'Toronto',
      'Los Angeles', 'San Francisco', 'Chicago', 'Bangkok', 'Singapore'
    ];
    return [...new Set([...popularCities, ...favorites])];
  }, [favorites]);

  const parseForecast = (list) => {
    const dailyMap = {};
    const weekDaysHu = ['Vasarnap', 'Hetfo', 'Kedd', 'Szerda', 'Csutortok', 'Pentek', 'Szombat'];

    list.forEach((item) => {
      const dayKey = item.dt_txt.split(' ')[0];
      const dt = new Date(item.dt * 1000);
      const dayNum = String(dt.getDate()).padStart(2, '0');
      const dayName = weekDaysHu[dt.getDay()];

      if (!dailyMap[dayKey]) {
        dailyMap[dayKey] = {
          dayNumber: dayNum,
          dayName,
          min: item.main.temp_min,
          max: item.main.temp_max,
          icon: item.weather[0].icon,
          iconScore: Math.abs(12 - dt.getHours())
        };
      } else {
        dailyMap[dayKey].min = Math.min(dailyMap[dayKey].min, item.main.temp_min);
        dailyMap[dayKey].max = Math.max(dailyMap[dayKey].max, item.main.temp_max);

        const hourDistance = Math.abs(12 - dt.getHours());
        if (hourDistance < dailyMap[dayKey].iconScore) {
          dailyMap[dayKey].icon = item.weather[0].icon;
          dailyMap[dayKey].iconScore = hourDistance;
        }
      }
    });

    return Object.values(dailyMap).slice(0, 5);
  };

  const fetchForecastByCity = (cityName, selectedUnit = unit) => {
    return fetch(`${api.url}forecast?q=${cityName}&units=${selectedUnit}&appid=${api.key}`)
      .then((resp) => resp.json())
      .then((result) => {
        if (result.cod === '200') {
          setForecast(parseForecast(result.list));
        } else {
          setForecast([]);
        }
      })
      .catch(() => {
        setForecast([]);
      });
  };

  const fetchForecastByCoords = (latitude, longitude, selectedUnit = unit) => {
    return fetch(`${api.url}forecast?lat=${latitude}&lon=${longitude}&units=${selectedUnit}&appid=${api.key}`)
      .then((resp) => resp.json())
      .then((result) => {
        if (result.cod === '200') {
          setForecast(parseForecast(result.list));
        } else {
          setForecast([]);
        }
      })
      .catch(() => {
        setForecast([]);
      });
  };

  useEffect(() => {
    document.title = 'hpeter-weather-app';

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetch(`${api.url}weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${api.key}`)
          .then((resp) => resp.json())
          .then((result) => {
            if (result.cod === 200) {
              setWeather(result);
              fetchForecastByCoords(latitude, longitude, unit);
            }
          });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (weather && weather.name) {
      handleSearch(weather.name, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  const toggleFavorite = (city) => {
    let newFavorites;
    if (favorites.includes(city)) {
      newFavorites = favorites.filter((f) => f !== city);
    } else {
      newFavorites = [...favorites, city];
    }
    setFavorites(newFavorites);
    localStorage.setItem('weather-favorites', JSON.stringify(newFavorites));
  };

  const saveRecentSearch = (city) => {
    const trimmedCity = city.trim();
    if (!trimmedCity) return;

    const newRecents = [
      trimmedCity,
      ...recentSearches.filter((c) => c.toLowerCase() !== trimmedCity.toLowerCase())
    ].slice(0, 5);

    setRecentSearches(newRecents);
    localStorage.setItem('weather-recent-searches', JSON.stringify(newRecents));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setErrorMessage('');

    if (value.trim().length > 0) {
      const filtered = allSuggestedCities.filter((c) =>
        c.toLowerCase().includes(value.toLowerCase().trim())
      );
      setFilteredCities(filtered);
      setIsDropdownOpen(filtered.length > 0);
      setActiveIndex(-1);
    } else {
      setFilteredCities(recentSearches);
      setIsDropdownOpen(recentSearches.length > 0);
      setActiveIndex(-1);
    }
  };

  const handleSelect = (city) => {
    setQuery(city);
    handleSearch(city);
    setFilteredCities([]);
    setIsDropdownOpen(false);
    setActiveIndex(-1);
  };

  const handleSearch = (city = query, keepInput = false) => {
    if (!city) {
      setErrorMessage('Please type a city name.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    fetch(`${api.url}weather?q=${city}&units=${unit}&appid=${api.key}`)
      .then((resp) => resp.json())
      .then((result) => {
        if (result.cod === 200) {
          setWeather(result);
          fetchForecastByCity(result.name);
          if (!keepInput) {
            setQuery('');
          }
          setFilteredCities([]);
          setIsDropdownOpen(false);
          setActiveIndex(-1);
          saveRecentSearch(result.name);
        } else {
          setErrorMessage('City not found. Please try another one.');
        }
      })
      .catch(() => {
        setErrorMessage('Could not load weather data. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported in this browser.');
      return;
    }

    setIsLocating(true);
    setErrorMessage('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        fetch(`${api.url}weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${api.key}`)
          .then((resp) => resp.json())
          .then((result) => {
            if (result.cod === 200) {
              setWeather(result);
              fetchForecastByCoords(latitude, longitude);
              setQuery('');
              setFilteredCities([]);
              setIsDropdownOpen(false);
              setActiveIndex(-1);
              saveRecentSearch(result.name);
            } else {
              setErrorMessage('Could not load your location weather.');
            }
          })
          .catch(() => {
            setErrorMessage('Could not load your location weather.');
          })
          .finally(() => {
            setIsLocating(false);
          });
      },
      () => {
        setErrorMessage('Location access denied.');
        setIsLocating(false);
      }
    );
  };

  const handleKeyDown = (e) => {
    if (!isDropdownOpen || filteredCities.length === 0) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < filteredCities.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredCities.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0) {
        handleSelect(filteredCities[activeIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setActiveIndex(-1);
    }
  };

  function dateFunction(d) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const day = days[d.getDay()];
    const date = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    return `${day}, ${date} ${month} ${year}`;
  }

  const setBG = () => {
    if (typeof weather.main === 'undefined') return 'app';
    if (weather.weather[0].main === 'Rain') return 'app rain';
    if (weather.weather[0].main === 'Clear') return 'app sunny';
    if (weather.weather[0].main === 'Clouds') return 'app cloud';
    if (weather.weather[0].main === 'Mist') return 'app mist';
    if (weather.weather[0].main === 'Fog') return 'app mist';
    return 'app cold';
  };

  return (
    <div className={setBG()}>
      <main>
        <div className="search-bar-wrapper">
          <div className="search-bar-row">
            <div className="search-bar">
              <input
                className="search-box"
                type="text"
                placeholder="Search city ..."
                onChange={handleInputChange}
                onFocus={() => {
                  if (query.trim().length > 0) {
                    setIsDropdownOpen(filteredCities.length > 0);
                  } else {
                    setFilteredCities(recentSearches);
                    setIsDropdownOpen(recentSearches.length > 0);
                  }
                }}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 150)}
                onKeyDown={handleKeyDown}
                value={query}
              />
              <button type="submit" className="search-btn" onClick={() => handleSearch()}>
                {isLoading ? <span className="search-loader"></span> : <img src="https://img.icons8.com/ios-filled/50/000000/search--v2.png" alt="" />}
              </button>
            </div>

            <button className="location-btn" onClick={handleUseMyLocation} disabled={isLocating}>
              {isLocating ? 'Locating...' : 'Use my location'}
            </button>
          </div>

          {isDropdownOpen && filteredCities.length > 0 && (
            <div className="autocomplete-dropdown">
              {query.trim().length === 0 && recentSearches.length > 0 && (
                <div className="dropdown-section-title">Recent searches</div>
              )}
              {filteredCities.map((city, index) => (
                <div
                  key={`${city}-${index}`}
                  className={`dropdown-item ${index === activeIndex ? 'active' : ''}`}
                  onMouseDown={() => handleSelect(city)}
                >
                  <span>{city}</span>
                  {favorites.includes(city) && <span className="city-favorite-icon">{STAR_FILLED}</span>}
                </div>
              ))}
            </div>
          )}

          {errorMessage && <p className="search-error">{errorMessage}</p>}
        </div>

        {typeof weather.main !== 'undefined' ? (
          <div className="weather-panel">
            <div className="location-box">
              <h2 className="location">
                {weather.name}, {weather.sys.country}
                <button className="favorite-btn" onClick={() => toggleFavorite(weather.name)}>
                  {favorites.includes(weather.name) ? STAR_FILLED : STAR_OUTLINE}
                </button>
              </h2>
              <p className="date">{dateFunction(new Date())}</p>

              <div className="unit-switch">
                <button className={`unit-btn ${unit === 'metric' ? 'active' : ''}`} onClick={() => setUnit('metric')}>{DEGREE}C</button>
                <button className={`unit-btn ${unit === 'imperial' ? 'active' : ''}`} onClick={() => setUnit('imperial')}>{DEGREE}F</button>
              </div>

              <div className="temp">{Math.round(weather.main.temp)}{unit === 'metric' ? `${DEGREE}C` : `${DEGREE}F`}</div>
              <p className="type">{weather.weather[0].main}</p>

              {forecast.length > 0 && (
                <div className="forecast-wrap">
                  <h4 className="forecast-title">5-Day Forecast</h4>
                  <div className="forecast-grid">
                    {forecast.map((day, idx) => (
                      <div className="forecast-card" key={`${day.dayNumber}-${day.dayName}-${idx}`}>
                        <p className="forecast-date-number">{day.dayNumber}</p>
                        <p className="forecast-day">{day.dayName}</p>
                        <img src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} alt={day.dayName} className="forecast-icon" />
                        <p className="forecast-temp">{Math.round(day.min)}{unit === 'metric' ? `${DEGREE}C` : `${DEGREE}F`} / {Math.round(day.max)}{unit === 'metric' ? `${DEGREE}C` : `${DEGREE}F`}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="other-dets">
                <h4 style={{ fontSize: '30px', fontWeight: '100', marginBottom: '30px' }}>Other details :</h4>
                <p className="others">Temp Range: {Math.round(weather.main.temp_min)}{unit === 'metric' ? `${DEGREE}C` : `${DEGREE}F`} / {Math.round(weather.main.temp_max)}{unit === 'metric' ? `${DEGREE}C` : `${DEGREE}F`}</p>
                <p className="others">Pressure: {weather.main.pressure} hPa</p>
                <p className="others">Humidity: {weather.main.humidity} %</p>
                <p className="others">Wind speed: {weather.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="welcome-box">
              <h2 className="app-name">Weather App</h2>
              <p className="comps">
                With React.js
                <br />
                22th September, 2022
                <br />
                By Peter Halasz
              </p>
              <div className="welcome-text">
                <h1>welcome</h1>
                <p>Weather updates for around 200,000 cities</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
