import React from 'react';
import { ForecastData } from '../../interfaces/weather';
import { formatDate, formatTime, getWeatherGradientClass, getWeatherIconUrl } from '../../utils/helpers';

interface WeatherCardProps {
  forecast: ForecastData;
  compact?: boolean;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ forecast, compact = false }) => {
  const gradientClass = getWeatherGradientClass(forecast.weather.main, forecast.date);

  if (compact) {
    return (
      <div className={`card shadow-sm weather-card ${gradientClass}`}>
        <div className="card-body p-4">
          <div className="text-center">
            <p className="font-medium">{formatTime(forecast.time)}</p>
            <div className="flex justify-center my-2">
              <img 
                src={getWeatherIconUrl(forecast.weather.icon)}
                alt={forecast.weather.description}
                className="w-12 h-12"
              />
            </div>
            <p className="text-lg font-bold">{forecast.temperature.current}°C</p>
            <p className="capitalize text-sm">{forecast.weather.description}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card shadow-md weather-card ${gradientClass}`}>
      <div className="card-body">
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
            <h3 className="card-header text-xl">{formatDate(forecast.date, 'EEEE, MMM d')}</h3>
            <p className="text-base">{formatTime(forecast.time)}</p>
            <p className="text-lg capitalize mt-2">{forecast.weather.description}</p>
          </div>

          <div className="flex items-center mx-auto md:mx-0">
            <img 
              src={getWeatherIconUrl(forecast.weather.icon)}
              alt={forecast.weather.description}
              className="w-16 h-16"
            />
            <div className="ml-4 text-center">
              <p className="text-3xl font-bold">{forecast.temperature.current}°C</p>
              <p className="text-sm">
                {forecast.temperature.min}°C / {forecast.temperature.max}°C
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 md:mt-0 md:ml-8">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Humidity: {forecast.humidity}%</span>
            </div>

            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
              <span>Pressure: {forecast.pressure} hPa</span>
            </div>

            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Wind: {forecast.wind.speed} m/s</span>
            </div>

            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4" />
              </svg>
              <span>Direction: {forecast.wind.direction}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
