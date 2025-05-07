import React, { useState } from 'react';
import { ForecastData } from '../../interfaces/weather';
import { formatDate, groupForecastByDay } from '../../utils/helpers';
import WeatherCard from './WeatherCard';

interface ForecastWeatherProps {
  forecastData: ForecastData[];
}

const ForecastWeather: React.FC<ForecastWeatherProps> = ({ forecastData }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  
  // Group forecast by days
  const forecastsByDay = groupForecastByDay(forecastData);
  
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">5-Day Forecast</h2>
      
      {/* Tabs for days */}
      <div className="tabs tabs-boxed mb-4">
        {forecastsByDay.map((day: ForecastData[], index: number) => (
          <button
            key={index}
            className={`tab ${activeTab === index ? 'tab-active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {formatDate(day[0].date, 'EEE, MMM d')}
          </button>
        ))}
      </div>
      
      {/* Hourly forecast for selected day */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {forecastsByDay[activeTab] && forecastsByDay[activeTab].slice(0, 8).map((forecast: ForecastData, index: number) => (
          <WeatherCard key={index} forecast={forecast} compact={true} />
        ))}
      </div>
      
      {/* Detailed forecast for selected day */}
      <div className="space-y-4">
        {forecastsByDay[activeTab] && forecastsByDay[activeTab].slice(0, 4).map((forecast: ForecastData, index: number) => (
          <WeatherCard key={index} forecast={forecast} />
        ))}
      </div>
    </div>
  );
};

export default ForecastWeather;