import { useState, useCallback } from 'react';
import { WeatherData, ForecastData, WeatherError } from '../interfaces/weather';
import weatherService from '../services/weatherService';

// 🌦️ Custom Hook for Weather State
export const useWeather = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<WeatherError | null>(null);

  const searchCity = useCallback(async (city: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const weatherData = await weatherService.getCurrentWeather(city);
      setCurrentWeather(weatherData);
      const forecastData = await weatherService.getForecast(city);
      setForecast(forecastData.forecasts);
    } catch (err) {
      const weatherError = err as WeatherError;
      setError(weatherError);
      console.error('Error fetching weather:', weatherError);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchByCoordinates = useCallback(async (lat: number, lon: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const weatherData = await weatherService.getWeatherByCoordinates(lat, lon);
      setCurrentWeather(weatherData);
      const forecastData = await weatherService.getForecastByCoordinates(lat, lon);
      setForecast(forecastData.forecasts);
    } catch (err) {
      const weatherError = err as WeatherError;
      setError(weatherError);
      console.error('Error fetching weather by coordinates:', weatherError);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    currentWeather,
    forecast,
    loading,
    error,
    searchCity,
    searchByCoordinates
  };
};

// 🎨 Weather-to-gradient mapping
export function getWeatherGradientClass(weatherMain: string, date?: string): string {
  switch (weatherMain.toLowerCase()) {
    case 'clear':
      return 'bg-gradient-to-r from-yellow-300 to-yellow-500';
    case 'clouds':
      return 'bg-gradient-to-r from-gray-400 to-gray-600';
    case 'rain':
      return 'bg-gradient-to-r from-blue-500 to-indigo-700';
    case 'thunderstorm':
      return 'bg-gradient-to-r from-gray-700 to-purple-800';
    case 'snow':
      return 'bg-gradient-to-r from-white to-blue-200';
    case 'drizzle':
      return 'bg-gradient-to-r from-teal-200 to-blue-300';
    case 'mist':
    case 'fog':
    case 'haze':
      return 'bg-gradient-to-r from-gray-300 to-gray-500';
    default:
      return 'bg-gradient-to-r from-slate-200 to-slate-400';
  }
}

// 📅 Date Formatter (with fallback to current date)
export function formatDate(timestamp?: number): string {
  const date = timestamp ? new Date(timestamp * 1000) : new Date();
  if (isNaN(date.getTime())) {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// 🕓 Time Formatter
export function formatTime(timestamp?: number): string {
  const date = timestamp ? new Date(timestamp * 1000) : new Date();
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

// 🌤️ Weather Icon URL
export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
