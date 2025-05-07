import React from 'react';
import Image from 'next/image';
import { WeatherData } from '../../interfaces/weather';
import { formatDate, formatTime, getWeatherGradientClass, getWeatherIconUrl } from '../../utils/helpers';

interface CurrentWeatherProps {
  weatherData: WeatherData;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weatherData }) => {
  const gradientClass = getWeatherGradientClass(weatherData.weather.main, weatherData.date);
  
  return (
    <div className={`card shadow-lg ${gradientClass}`}>
      <div className="card-body">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center md:text-left">
            <h2 className="card-header text-3xl">
              {weatherData.city}, {weatherData.country}
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
                <p className="text-4xl font-bold">{weatherData.temperature.current}°C</p>
                <p className="text-xl">Feels like: {weatherData.temperature.feels_like}°C</p>
              </div>
            </div>
            <p className="text-xl mt-4 capitalize">{weatherData.weather.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="stat">
              <div className="stat-title">Wind</div>
              <div className="stat-value text-lg">{weatherData.wind.speed} m/s</div>
              <div className="stat-desc">{weatherData.wind.direction}</div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Humidity</div>
              <div className="stat-value text-lg">{weatherData.humidity}%</div>
              <div className="stat-desc">Atmospheric moisture</div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Pressure</div>
              <div className="stat-value text-lg">{weatherData.pressure} hPa</div>
              <div className="stat-desc">Atmospheric pressure</div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Visibility</div>
              <div className="stat-value text-lg">{weatherData.visibility / 1000} km</div>
              <div className="stat-desc">How far you can see</div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Sunrise</div>
              <div className="stat-value text-lg">{formatTime(weatherData.sunrise)}</div>
              <div className="stat-desc">Dawn breaks</div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Sunset</div>
              <div className="stat-value text-lg">{formatTime(weatherData.sunset)}</div>
              <div className="stat-desc">Day's end</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;