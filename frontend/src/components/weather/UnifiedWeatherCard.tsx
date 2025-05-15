import React from 'react';
import { WeatherData } from '../../interfaces/weather';
import { formatDate, formatTime, getWeatherIconUrl } from '../../utils/helpers';

interface Props {
  weatherData: WeatherData;
}

const UnifiedWeatherCard: React.FC<Props> = ({ weatherData }) => {
  return (
    <div className="bg-gray-900 text-white rounded-lg shadow-lg p-8 max-w-5xl mx-auto mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        {/* Location + Date */}
        <div className="mb-4 md:mb-0">
          <h2 className="text-3xl font-bold">
            {weatherData.city}, {weatherData.country}
          </h2>
          <p className="text-lg text-gray-300">
            {formatDate(weatherData.timestamp)}
          </p>
        </div>

        {/* Icon + Temperature */}
        <div className="flex items-center space-x-4">
          <img
            src={getWeatherIconUrl(weatherData.weather.icon)}
            alt={weatherData.weather.description}
            className="h-16 w-16"
          />
          <div>
            <p className="text-4xl font-bold">{weatherData.temperature.current.toFixed(1)}°C</p>
            <p className="text-sm text-gray-300">
              Feels like: {weatherData.temperature.feels_like.toFixed(1)}°C
            </p>
            <p className="text-sm capitalize text-gray-400">{weatherData.weather.description}</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 my-6"></div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm md:text-base">
        <div>
          <h4 className="font-semibold mb-1">Temperature</h4>
          <p>Min: {weatherData.temperature.min.toFixed(1)}°C</p>
          <p>Max: {weatherData.temperature.max.toFixed(1)}°C</p>
        </div>
        <div>
          <h4 className="font-semibold mb-1">Wind</h4>
          <p>Speed: {weatherData.wind.speed} m/s</p>
          <p>Direction: {weatherData.wind.direction} ({weatherData.wind.deg}°)</p>
        </div>
        <div>
          <h4 className="font-semibold mb-1">Atmosphere</h4>
          <p>Humidity: {weatherData.humidity}%</p>
          <p>Pressure: {weatherData.pressure} hPa</p>
          <p>Visibility: {(weatherData.visibility / 1000).toFixed(1)} km</p>
        </div>
        <div>
          <h4 className="font-semibold mb-1">Sun</h4>
          <p>Sunrise: {formatTime(weatherData.sunrise)}</p>
          <p>Sunset: {formatTime(weatherData.sunset)}</p>
          <p>Timezone: UTC{weatherData.timezone >= 0 ? '+' : ''}{weatherData.timezone / 3600}</p>
        </div>
      </div>
    </div>
  );
};

export default UnifiedWeatherCard;
