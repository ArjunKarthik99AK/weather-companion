import { WEATHER_CONFIG } from "@/config/weather";

interface ForecastItem {
  dt: number;
  main: { temp_max: number; temp_min: number };
  weather: { icon: string; description: string }[];
}

interface ForecastProps {
  data: ForecastItem[];
  unit: "metric" | "imperial";
}

/** 5-day forecast strip */
const Forecast = ({ data, unit }: ForecastProps) => {
  const tempSymbol = unit === "metric" ? "°C" : "°F";

  // Group by day and pick the midday entry (or first available)
  const daily: ForecastItem[] = [];
  const seen = new Set<string>();

  for (const item of data) {
    const day = new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "short" });
    if (!seen.has(day) && daily.length < 5) {
      seen.add(day);
      daily.push(item);
    }
  }

  return (
    <div className="forecast-section">
      <h2>5-Day Forecast</h2>
      <div className="forecast-grid">
        {daily.map((item) => {
          const dayName = new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "short" });
          const icon = item.weather[0]?.icon;
          return (
            <div className="forecast-card" key={item.dt}>
              <p className="day-name">{dayName}</p>
              {icon && (
                <img
                  className="forecast-icon"
                  src={`${WEATHER_CONFIG.ICON_URL}/${icon}@2x.png`}
                  alt={item.weather[0]?.description}
                />
              )}
              <p className="forecast-temp">{Math.round(item.main.temp_max)}{tempSymbol}</p>
              <p className="forecast-low">{Math.round(item.main.temp_min)}{tempSymbol}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Forecast;
