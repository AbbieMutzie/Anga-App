import { useState, useCallback } from 'react';
import { WeatherData, ForecastData, WeatherError } from '../interfaces/weather';
import weatherService from '../services/weatherService';

export const useWeather = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<WeatherError | null>(null);

  const searchCity = useCallback(async (city: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch current weather
      const weatherData = await weatherService.getCurrentWeather(city);
      setCurrentWeather(weatherData);
      
      // Fetch forecast
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
      
      // Fetch current weather by coordinates
      const weatherData = await weatherService.getWeatherByCoordinates(lat, lon);
      setCurrentWeather(weatherData);
      
      // Fetch forecast by coordinates
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