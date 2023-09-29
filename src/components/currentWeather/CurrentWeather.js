import "./CurrentWeather.css";

function convertTemperature(temp, toUnit) {
  if (toUnit === "°C") {
    return temp;
  } else {
    return (temp * 9) / 5 + 32;
  }
}

export default function CurrentWeather({ data, unit, onUnitChange }) {
  const temperature =
    unit === "°C"
      ? Math.round(data.main.temp)
      : Math.round(convertTemperature(data.main.temp, "°F"));
  const feelsLike =
    unit === "°C"
      ? Math.round(data.main.feels_like)
      : Math.round(convertTemperature(data.main.feels_like, "°F"));

  return (
    <div className="weather">
      <div className="top">
        <div>
          <p className="city">{data.city}</p>
          <p className="weather-description">{data.weather[0].description}</p>
        </div>
        <img
          alt="weather"
          className="weather-icon"
          src={`icons/${data.weather[0].icon}.png`}
        />
      </div>
      <div className="bottom">
        <div className="units">
          <p
            onClick={() => onUnitChange("°C")}
            className={unit === "°C" ? "active" : ""}
          >
            °C
          </p>
          <p className="pipe">|</p>
          <p
            onClick={() => onUnitChange("°F")}
            className={unit === "°F" ? "active" : ""}
          >
            °F
          </p>
        </div>

        <div className="temperature">
          <p>{temperature}</p>
        </div>
        <div className="details">
          <div className="parameter-row">
            <span className="parameter-label">Feels like : </span>
            <span className="parameter-value">
              {" "}
              {feelsLike} {unit}
            </span>
          </div>
          <div className="parameter-row">
            <span className="parameter-label">Wind :</span>
            <span className="parameter-value">{data.wind.speed} m/s</span>
          </div>
          <div className="parameter-row">
            <span className="parameter-label">Humidity :</span>
            <span className="parameter-value">{data.main.humidity}%</span>
          </div>
          <div className="parameter-row">
            <span className="parameter-label">Pressure :</span>
            <span className="parameter-value">{data.main.pressure} hPa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
