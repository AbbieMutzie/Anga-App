export interface WeatherData {
    city: string;
    country: string;
    date: string;
    temperature: {
      current: number;
      feels_like: number;
      min: number;
      max: number;
    };
    weather: {
      main: string;
      description: string;
      icon: string;
    };
    wind: {
      speed: number;
      direction: string;
      deg: number;
    };
    humidity: number;
    pressure: number;
    visibility: number;
    sunrise: string;
    sunset: string;
    timezone: number;
  }
  
  export interface ForecastData extends WeatherData {
    time: string;
  }
  
  export interface ForecastResponse {
    city: {
      name: string;
      country: string;
    };
    forecasts: ForecastData[];
  }
  
  export interface WeatherError {
    message: string;
    status: number;
  }
  
  export type WeatherContextType = {
    currentWeather: WeatherData | null;
    forecast: ForecastData[] | null;
    loading: boolean;
    error: WeatherError | null;
    searchCity: (city: string) => Promise<void>;
    searchByCoordinates: (lat: number, lon: number) => Promise<void>;
  };