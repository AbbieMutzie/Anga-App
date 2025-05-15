import React from 'react';
import { WeatherData } from '../../interfaces/weather';

interface Props {
  weatherData: WeatherData;
}

const WeatherDetails: React.FC<Props> = ({ weatherData }) => {
  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-2xl font-bold mb-4">Weather Details</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm md:text-base">
        <div>
          <h4 className="font-semibold mb-1">Temperature</h4>
          <p>Current: {weatherData.temperature.current}°C</p>
          <p>Feels like: {weatherData.temperature.feels_like}°C</p>
          <p>Min: {weatherData.temperature.min}°C</p>
          <p>Max: {weatherData.temperature.max}°C</p>
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
          <p>Sunrise: {weatherData.sunrise}</p>
          <p>Sunset: {weatherData.sunset}</p>
          <p>Timezone: UTC{weatherData.timezone >= 0 ? '+' : ''}{weatherData.timezone / 3600}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;
