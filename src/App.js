import React, { useState } from "react";
import Search from "./components/search/Search";
import CurrentWeather from "./components/currentWeather/CurrentWeather";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./api";
import "./App.css";

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("°C");

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

    Promise.all([currentWeatherFetch])
      .then(async (response) => {
        if (response[0].ok) {
          const weatherResponse = await response[0].json();
          if (
            weatherResponse.name &&
            weatherResponse.main &&
            weatherResponse.weather
          ) {
            setCurrentWeather({ city: searchData.label, ...weatherResponse });
            setError(null);
          } else {
            setError(
              "Only limited calls are allowed per minute from the weather API. Please try again in a minute."
            );
          }
        } else {
          throw new Error(
            "Weather data not available for the specified location."
          );
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleTryAgain = () => {
    setError(null); 
    fetchWeatherByGeolocation(); 
  };

  const handleUnitChange = (selectedUnit) => {
    setUnit(selectedUnit);
  };

  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange} />
      <button onClick={fetchWeatherByGeolocation}>Get My Location</button>
      {error ? (
        <div>
          <p className="error-message">{error}</p>
          <button onClick={handleTryAgain}>Try Again</button>
        </div>
      ) : null}
      {currentWeather && (
        <CurrentWeather
          data={currentWeather}
          unit={unit}
          onUnitChange={handleUnitChange}
        />
      )}
    </div>
  );
}

export default App;
