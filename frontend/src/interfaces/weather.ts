export interface WeatherData {
  city: string;
  country: string;
  date: number; // Unix timestamp
  temperature: {
    current: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
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
    gust?: number; // Optional
  };
  humidity: number;
  pressure: number;
  visibility: number;
  sunrise: number; // Unix timestamp
  sunset: number;  // Unix timestamp
  timezone: number;
}

export interface ForecastData extends WeatherData {
  time: string; // Additional field for forecasts (if used)
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
