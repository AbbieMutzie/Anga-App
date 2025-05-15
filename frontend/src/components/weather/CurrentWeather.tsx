import React from 'react';
import { WeatherData } from '../../interfaces/weather';
import { formatDate, formatTime, getWeatherGradientClass, getWeatherIconUrl } from '../../utils/helpers';

interface CurrentWeatherProps {
  weatherData: WeatherData;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weatherData }) => {
  const gradientClass = getWeatherGradientClass(weatherData.weather.main, weatherData.date);

  return (
    <div className={`card shadow-lg ${gradientClass} max-w-4xl mx-auto p-6`}>
      <div className="card-body">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left section: main info */}
          <div className="text-center md:text-left">
            <h2 className="card-header text-3xl font-bold">
              {weatherData.city && weatherData.city !== ''
                ? `${weatherData.city}, ${weatherData.country}`
                : `${weatherData.country}`}
            </h2>
            <p className="text-lg">{formatDate(weatherData.date)}</p>

            <div className="flex items-center justify-center md:justify-start mt-4">
              <div className="relative h-20 w-20">
                <img
                  src={getWeatherIconUrl(weatherData.weather.icon)}
                  alt={weatherData.weather.description}
                  className="w-full h-full"
                />
              </div>
              <div className="ml-4">
                <p className="text-4xl font-bold">{weatherData.temperature.current.toFixed(1)}°C</p>
                <p className="text-xl">Feels like: {weatherData.temperature.feels_like.toFixed(1)}°C</p>
              </div>
            </div>
            <p className="text-xl mt-4 capitalize">{weatherData.weather.description}</p>
          </div>

          {/* Right section: weather stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 text-center md:text-left">
            {/* Wind */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Wind</h3>
              <p>Speed: {weatherData.wind.speed} m/s</p>
              <p>Direction: {weatherData.wind.direction} ({weatherData.wind.deg}°)</p>
            </div>

            {/* Atmosphere */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Atmosphere</h3>
              <p>Humidity: {weatherData.humidity}%</p>
              <p>Pressure: {weatherData.pressure} hPa</p>
              <p>Visibility: {(weatherData.visibility / 1000).toFixed(1)} km</p>
            </div>

            {/* Sun */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Sun</h3>
              <p>Sunrise: {formatTime(weatherData.sunrise)}</p>
              <p>Sunset: {formatTime(weatherData.sunset)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
