import { WeatherData, ForecastResponse } from '../interfaces/weather';

class WeatherService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api';
  }

  private async fetchWithErrorHandling<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw {
          status: response.status,
          message: errorData.message || 'An error occurred while fetching weather data',
        };
      }

      return await response.json() as T;
    } catch (error) {
      if (error instanceof Error) {
        throw {
          status: 500,
          message: error.message,
        };
      }
      throw error;
    }
  }

  public async getCurrentWeather(city: string): Promise<WeatherData> {
    const url = `${this.baseUrl}/weather/current?city=${encodeURIComponent(city)}`;
    return this.fetchWithErrorHandling<WeatherData>(url);
  }

  public async getForecast(city: string): Promise<ForecastResponse> {
    const url = `${this.baseUrl}/weather/forecast?city=${encodeURIComponent(city)}`;
    return this.fetchWithErrorHandling<ForecastResponse>(url);
  }

  public async getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData> {
    const url = `${this.baseUrl}/weather/coordinates?lat=${lat}&lon=${lon}`;
    return this.fetchWithErrorHandling<WeatherData>(url);
  }

  public async getForecastByCoordinates(lat: number, lon: number): Promise<ForecastResponse> {
    const url = `${this.baseUrl}/weather/forecast/coordinates?lat=${lat}&lon=${lon}`;
    return this.fetchWithErrorHandling<ForecastResponse>(url);
  }
}

const weatherService = new WeatherService();
export default weatherService;
