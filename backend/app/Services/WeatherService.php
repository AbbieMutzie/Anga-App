<?php

namespace App\Services;

use App\DTO\WeatherData;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class WeatherService
{
    /**
     * Base URL for OpenWeatherMap API
     *
     * @var string
     */
    protected $baseUrl = 'https://api.openweathermap.org/data/2.5';
    
    /**
     * API key for OpenWeatherMap
     *
     * @var string
     */
    protected $apiKey;
    
    /**
     * Cache TTL in seconds (30 minutes)
     *
     * @var int
     */
    protected $cacheTtl = 1800;
    
    /**
     * Create a new service instance.
     */
    public function __construct()
    {
        $this->apiKey = config('services.openweathermap.key');
        
        if (!$this->apiKey) {
            Log::error('OpenWeatherMap API key is not set');
        }
    }
    
    /**
     * Get current weather data by city name
     *
     * @param string $city
     * @return array
     * @throws \Exception
     */
    public function getCurrentWeatherByCity(string $city): array
    {
        $cacheKey = 'weather_current_' . strtolower(str_replace(' ', '_', $city));
        
        return Cache::remember($cacheKey, $this->cacheTtl, function () use ($city) {
            $response = Http::get("{$this->baseUrl}/weather", [
                'q' => $city,
                'appid' => $this->apiKey,
                'units' => 'metric', // Use metric units by default
            ]);
            
            if ($response->failed()) {
                Log::error('Failed to fetch current weather data', [
                    'city' => $city,
                    'status' => $response->status(),
                    'response' => $response->json(),
                ]);
                
                throw new \Exception($response->json()['message'] ?? 'Unknown error');
            }
            
            $data = $response->json();
            
            // Transform data to our standardized format using DTO
            return (new WeatherData($data))->toArray();
        });
    }
    
    /**
     * Get weather forecast by city name (5 days / 3 hours)
     *
     * @param string $city
     * @return array
     * @throws \Exception
     */
    public function getForecastByCity(string $city): array
    {
        $cacheKey = 'weather_forecast_' . strtolower(str_replace(' ', '_', $city));
        
        return Cache::remember($cacheKey, $this->cacheTtl, function () use ($city) {
            $response = Http::get("{$this->baseUrl}/forecast", [
                'q' => $city,
                'appid' => $this->apiKey,
                'units' => 'metric',
            ]);
            
            if ($response->failed()) {
                Log::error('Failed to fetch forecast data', [
                    'city' => $city,
                    'status' => $response->status(),
                    'response' => $response->json(),
                ]);
                
                throw new \Exception($response->json()['message'] ?? 'Unknown error');
            }
            
            $data = $response->json();
            
            // Group forecast data by day for easier consumption by frontend
            $result = [
                'city' => $data['city'],
                'forecast' => $this->transformForecastData($data['list'])
            ];
            
            return $result;
        });
    }
    
    /**
     * Get weather data by geographic coordinates
     *
     * @param float $lat
     * @param float $lon
     * @return array
     * @throws \Exception
     */
    public function getWeatherByCoordinates(float $lat, float $lon): array
    {
        $cacheKey = "weather_geo_{$lat}_{$lon}";
        
        return Cache::remember($cacheKey, $this->cacheTtl, function () use ($lat, $lon) {
            $response = Http::get("{$this->baseUrl}/weather", [
                'lat' => $lat,
                'lon' => $lon,
                'appid' => $this->apiKey,
                'units' => 'metric',
            ]);
            
            if ($response->failed()) {
                Log::error('Failed to fetch weather data by coordinates', [
                    'lat' => $lat,
                    'lon' => $lon,
                    'status' => $response->status(),
                    'response' => $response->json(),
                ]);
                
                throw new \Exception($response->json()['message'] ?? 'Unknown error');
            }
            
            $data = $response->json();
            
            // Transform data to our standardized format using DTO
            return (new WeatherData($data))->toArray();
        });
    }
    
    /**
     * Transform forecast data into daily groups
     * 
     * @param array $forecastList
     * @return array
     */
    protected function transformForecastData(array $forecastList): array
    {
        $groupedForecast = [];
        
        foreach ($forecastList as $item) {
            $date = date('Y-m-d', $item['dt']);
            
            if (!isset($groupedForecast[$date])) {
                $groupedForecast[$date] = [
                    'date' => $date,
                    'day_name' => date('l', $item['dt']),
                    'items' => []
                ];
            }
            
            $groupedForecast[$date]['items'][] = [
                'time' => date('H:i', $item['dt']),
                'temp' => $item['main']['temp'],
                'feels_like' => $item['main']['feels_like'],
                'humidity' => $item['main']['humidity'],
                'description' => $item['weather'][0]['description'],
                'icon' => $item['weather'][0]['icon'],
                'wind_speed' => $item['wind']['speed'],
                'wind_direction' => $item['wind']['deg'],
                'clouds' => $item['clouds']['all'],
                'precipitation' => $item['pop'],
            ];
        }
        
        // Convert to indexed array for easier frontend handling
        return array_values($groupedForecast);
    }
}