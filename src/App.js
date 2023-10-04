import React, { useState } from "react";
import Search from "./components/search/Search";
import CurrentWeather from "./components/currentWeather/CurrentWeather";
import Forecast from "./components/forecast/Forecast";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./api";
import "./App.css";

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("°C");

  const fetchWeatherData = async (url) => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error("Weather data not available.");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const handleOnSearchChange = async (searchData) => {
    try {
      const [lat, lon] = searchData.value.split(" ");
      const currentWeatherUrl = `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
      const forecastUrl = `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;

      const [weatherResponse, forecastResponse] = await Promise.all([
        fetchWeatherData(currentWeatherUrl),
        fetchWeatherData(forecastUrl),
      ]);

      setCurrentWeather({ city: searchData.label, ...weatherResponse });
      setForecast({ city: searchData.label, ...forecastResponse });
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchWeatherByGeolocation = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      const currentWeatherUrl = `${WEATHER_API_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`;
      const forecastUrl = `${WEATHER_API_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`;

      const [weatherResponse, forecastResponse] = await Promise.all([
        fetchWeatherData(currentWeatherUrl),
        fetchWeatherData(forecastUrl),
      ]);

      setCurrentWeather({ city: weatherResponse.name, ...weatherResponse });
      setForecast({ city: weatherResponse.name, ...forecastResponse });
      setError(null);
    } catch (error) {
      setError(`Geolocation error: ${error.message}`);
    }
  };

  const handleUnitChange = (selectedUnit) => {
    setUnit(selectedUnit);
  };

  return (
    <>
      <div className="home-page">
        <div className="container">
          <Search
            onSearchChange={handleOnSearchChange}
          />
          <button onClick={fetchWeatherByGeolocation}>
            <img
              src="https://i.ibb.co/Z6dcHjW/e9df16606f3a0d45686063c1b9593bfc.jpg"
              alt="Geolocation"
            />
          </button>
        </div>
        {currentWeather && (
          <CurrentWeather
            data={currentWeather}
            unit={unit}
            onUnitChange={handleUnitChange}
          />
        )}
        {forecast && (
          <Forecast
            data={forecast}
            unit={unit}
            onUnitChange={handleUnitChange}
          />
        )}
        {error && <p className="error-message">{error}</p>}
      </div>
    </>
  );
}

export default App;

/*
import { useState } from "react";
import Search from "./components/search/Search";
import CurrentWeather from "./components/currentWeather/CurrentWeather"
import Forecast from "./components/forecast/Forecast";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./api";
import "./App.css";

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);
  //const [unit, setUnit] = useState("°C");

  const fetchWeatherByGeolocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `${WEATHER_API_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`
            );
            if (response.ok) {
              const weatherResponse = await response.json();
              if (
                weatherResponse.name &&
                weatherResponse.main &&
                weatherResponse.weather
              ) {
                setCurrentWeather({
                  city: weatherResponse.name,
                  ...weatherResponse,
                });
                setError(null); 
              } else {
                setError("Invalid response format from the weather API.");
              }
            } else {
              throw new Error("Weather data not available for your location.");
            }
          } catch (error) {
            setError(error.message);
          }
        },
        (error) => {
          setError(`Geolocation error: ${error.message}`);
        }
      );
    } else {
      setError("Geolocation is not available in this browser.");
    }
  };

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");

    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forcastResponse = await response[1].json();

        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forcastResponse });
      })
      .catch(console.log);
  };

  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange} />
      <button onClick={fetchWeatherByGeolocation}>Get My Location</button>
      {currentWeather && <CurrentWeather data={currentWeather} />}
      {forecast && <Forecast data={forecast} />}
    </div>
  );
}

export default App;*/
