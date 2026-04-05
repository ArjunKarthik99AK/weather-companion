import { useState, useEffect, useCallback } from "react";
import { WEATHER_CONFIG } from "@/config/weather";
import SearchBar from "@/components/weather/SearchBar";
import WeatherCard from "@/components/weather/WeatherCard";
import Forecast from "@/components/weather/Forecast";
import "@/styles/weather.css";

const LAST_CITY_KEY = "weather_last_city";

const Index = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [darkMode, setDarkMode] = useState(false);

  /** Fetch current weather + forecast by city name */
  const fetchWeatherByCity = useCallback(async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`${WEATHER_CONFIG.BASE_URL}/weather?q=${encodeURIComponent(city)}&units=${unit}&appid=${WEATHER_CONFIG.API_KEY}`),
        fetch(`${WEATHER_CONFIG.BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=${unit}&appid=${WEATHER_CONFIG.API_KEY}`),
      ]);

      if (!weatherRes.ok) {
        const err = await weatherRes.json();
        throw new Error(err.message || "City not found");
      }

      const weather = await weatherRes.json();
      const forecast = await forecastRes.json();

      setWeatherData(weather);
      setForecastData(forecast.list ?? []);
      localStorage.setItem(LAST_CITY_KEY, city);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
      setWeatherData(null);
      setForecastData([]);
    } finally {
      setLoading(false);
    }
  }, [unit]);

  /** Fetch weather by coordinates */
  const fetchWeatherByCoords = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`${WEATHER_CONFIG.BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${WEATHER_CONFIG.API_KEY}`),
        fetch(`${WEATHER_CONFIG.BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${WEATHER_CONFIG.API_KEY}`),
      ]);

      if (!weatherRes.ok) throw new Error("Unable to fetch weather for your location");

      const weather = await weatherRes.json();
      const forecast = await forecastRes.json();

      setWeatherData(weather);
      setForecastData(forecast.list ?? []);
      localStorage.setItem(LAST_CITY_KEY, weather.name);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [unit]);

  /** Get user's current location */
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
      () => setError("Location permission denied")
    );
  };

  /** Load last searched city on mount */
  useEffect(() => {
    const lastCity = localStorage.getItem(LAST_CITY_KEY);
    if (lastCity) fetchWeatherByCity(lastCity);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /** Re-fetch when unit changes (if we have data) */
  useEffect(() => {
    if (weatherData?.name) fetchWeatherByCity(weatherData.name);
  }, [unit]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`weather-app${darkMode ? " dark" : ""}`}>
      <h1>🌤 Weather Report</h1>
      <p className="subtitle">Real-time weather &amp; 5-day forecast</p>

      {/* Top-bar toggles */}
      <div className="top-bar">
        <button
          className="toggle-btn"
          onClick={() => setUnit(unit === "metric" ? "imperial" : "metric")}
        >
          {unit === "metric" ? "°C → °F" : "°F → °C"}
        </button>
        <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <SearchBar
        onSearch={fetchWeatherByCity}
        onGetLocation={handleGetLocation}
        isLoading={loading}
      />

      {/* Loading spinner */}
      {loading && (
        <div className="spinner-wrapper">
          <div className="spinner" />
          <p>Fetching weather…</p>
        </div>
      )}

      {/* Error display */}
      {error && !loading && (
        <div className="error-box">
          <p className="error-title">Oops!</p>
          <p className="error-message">{error}</p>
        </div>
      )}

      {/* Current weather */}
      {weatherData && !loading && (
        <WeatherCard data={weatherData} unit={unit} />
      )}

      {/* 5-day forecast */}
      {forecastData.length > 0 && !loading && (
        <Forecast data={forecastData} unit={unit} />
      )}
    </div>
  );
};

export default Index;
