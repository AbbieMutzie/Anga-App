import React from 'react';
import { WeatherData } from '../../interfaces/weather';
import { formatTime } from '../../utils/helpers';

interface WeatherDetailsProps {
  weatherData: WeatherData;
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ weatherData }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Weather Details</h2>
      
      <div className="card shadow-md">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Temperature Section */}
            <div className="card bg-base-100">
              <div className="card-body p-4">
                <h3 className="card-header text-lg">Temperature</h3>
                <div className="divider my-2"></div>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span>Current:</span>
                  <span className="font-semibold">{weatherData.temperature.current}°C</span>
                  
                  <span>Feels Like:</span>
                  <span className="font-semibold">{weatherData.temperature.feels_like}°C</span>
                  
                  <span>Min:</span>
                  <span className="font-semibold">{weatherData.temperature.min}°C</span>
                  
                  <span>Max:</span>
                  <span className="font-semibold">{weatherData.temperature.max}°C</span>
                </div>
              </div>
            </div>
            
            {/* Wind Section */}
            <div className="card bg-base-100">
              <div className="card-body p-4">
                <h3 className="card-header text-lg">Wind</h3>
                <div className="divider my-2"></div>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span>Speed:</span>
                  <span className="font-semibold">{weatherData.wind.speed} m/s</span>
                  
                  <span>Direction:</span>
                  <span className="font-semibold">{weatherData.wind.direction} ({weatherData.wind.deg}°)</span>
                </div>
                <div className="mt-4 flex justify-center">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-2 border-gray-300"></div>
                    <div 
                      className="absolute w-1 h-10 bg-blue-500 origin-bottom"
                      style={{ 
                        top: '0', 
                        left: '50%',
                        transform: `translateX(-50%) rotate(${weatherData.wind.deg}deg)`
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center text-xs">
                      N
                    </div>
                    <div className="absolute inset-0 flex items-start justify-center pt-1 text-xs">
                      S
                    </div>
                    <div className="absolute inset-0 flex items-center justify-start pl-1 text-xs">
                      W
                    </div>
                    <div className="absolute inset-0 flex items-center justify-end pr-1 text-xs">
                      E
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Atmospheric Section */}
            <div className="card bg-base-100">
              <div className="card-body p-4">
                <h3 className="card-header text-lg">Atmospheric</h3>
                <div className="divider my-2"></div>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span>Humidity:</span>
                  <span className="font-semibold">{weatherData.humidity}%</span>
                  
                  <span>Pressure:</span>
                  <span className="font-semibold">{weatherData.pressure} hPa</span>
                  
                  <span>Visibility:</span>
                  <span className="font-semibold">{weatherData.visibility / 1000} km</span>
                </div>
              </div>
            </div>
            
            {/* Sun Section */}
            <div className="card bg-base-100">
              <div className="card-body p-4">
                <h3 className="card-header text-lg">Sun</h3>
                <div className="divider my-2"></div>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span>Sunrise:</span>
                  <span className="font-semibold">{formatTime(weatherData.sunrise)}</span>
                  
                  <span>Sunset:</span>
                  <span className="font-semibold">{formatTime(weatherData.sunset)}</span>
                  
                  <span>Timezone:</span>
                  <span className="font-semibold">UTC {weatherData.timezone / 3600 >= 0 ? '+' : ''}{weatherData.timezone / 3600}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;