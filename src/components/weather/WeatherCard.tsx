import { WEATHER_CONFIG } from "@/config/weather";

interface WeatherData {
  name: string;
  main: { temp: number; humidity: number; feels_like: number; pressure: number };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
  dt: number;
}

interface WeatherCardProps {
  data: WeatherData;
  unit: "metric" | "imperial";
}

/** Main current-weather display card */
const WeatherCard = ({ data, unit }: WeatherCardProps) => {
  const tempSymbol = unit === "metric" ? "°C" : "°F";
  const windUnit = unit === "metric" ? "m/s" : "mph";
  const icon = data.weather[0]?.icon;
  const description = data.weather[0]?.description ?? "";

  // Format current date
  const dateStr = new Date(data.dt * 1000).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="weather-card">
      <p className="city-name">{data.name}</p>
      <p className="date-text">{dateStr}</p>

      <div className="icon-row">
        {icon && (
          <img
            className="weather-icon"
            src={`${WEATHER_CONFIG.ICON_URL}/${icon}@2x.png`}
            alt={description}
          />
        )}
        <span className="temperature">
          {Math.round(data.main.temp)}{tempSymbol}
        </span>
      </div>

      <p className="condition">{description}</p>

      <div className="details-grid">
        <div className="detail-item">
          <span className="detail-label">Feels Like</span>
          <span className="detail-value">{Math.round(data.main.feels_like)}{tempSymbol}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{data.main.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Wind</span>
          <span className="detail-value">{data.wind.speed} {windUnit}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Pressure</span>
          <span className="detail-value">{data.main.pressure} hPa</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
