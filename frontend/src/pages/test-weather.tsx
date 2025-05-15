import { useEffect, useState } from 'react';
import weatherService from '@/services/WeatherService';

export default function TestWeatherPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    weatherService.getCurrentWeather('Nairobi')
      .then(setData)
      .catch((err) => {
        setError(err.message || 'Unknown error');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-blue-500">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Weather in {data.name}</h1>
      <p className="text-lg capitalize">{data.weather.description}</p>
      <p className="text-lg">Temp: {data.temperature.current}°C</p>
      <p className="text-sm">Humidity: {data.humidity}%</p>
      <p className="text-sm">Wind: {data.wind.speed} m/s, Direction: {data.wind.direction}</p>
    </div>
  );
}
