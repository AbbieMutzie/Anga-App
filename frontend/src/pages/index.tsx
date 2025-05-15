import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import SearchBar from '../components/weather/SearchBar';
import ForecastWeather from '../components/weather/ForecastWeather';
import UnifiedWeatherCard from '../components/weather/UnifiedWeatherCard';
import { useWeather } from '../hooks/useWeather';

const Home: NextPage = () => {
  const { currentWeather, forecast, loading, error, searchCity, searchByCoordinates } = useWeather();
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (initialLoad) {
      searchCity('London');
      setInitialLoad(false);
    }
  }, [initialLoad, searchCity]);

  const handleSearch = (city: string) => {
    searchCity(city);
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          searchByCoordinates(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          searchCity('London');
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      searchCity('London');
    }
  };

  return (
    <>
      <Head>
        <title>Weather App</title>
        <meta name="description" content="Get current weather and forecasts for any city" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Weather Forecast</h1>
          <p className="text-lg text-gray-600">Get real-time weather information for any city</p>
        </div>

        <SearchBar 
          onSearch={handleSearch} 
          onUseLocation={handleUseLocation} 
          isLoading={loading} 
        />

        {error && (
          <div className="alert alert-error mb-8">
            <div className="flex-1">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                className="w-6 h-6 mx-2 stroke-current"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                ></path>
              </svg>
              <label>{error.message}</label>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center my-20">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        )}

        {!loading && currentWeather && (
          <UnifiedWeatherCard weatherData={currentWeather} />
        )}

        {!loading && forecast && forecast.length > 0 && (
          <ForecastWeather forecastData={forecast} />
        )}
      </div>
    </>
  );
};

export default Home;
