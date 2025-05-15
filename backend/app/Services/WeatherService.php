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
     */
    protected string $baseUrl = 'https://api.openweathermap.org/data/2.5';

    /**
     * API key for OpenWeatherMap
     */
    protected string $apiKey;

    /**
     * Cache TTL in seconds (30 minutes)
     */
    protected int $cacheTtl = 1800;

    /**
     * Units system (e.g. metric, imperial)
     */
    protected string $units;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->apiKey = config('services.openweathermap.key');
        $this->units = config('weather.units', 'metric');

        if (!$this->apiKey) {
            Log::error('OpenWeatherMap API key is not set.');
        }
    }

    /**
     * Get current weather by city name
     */
    public function getCurrentWeatherByCity(string $city): array
    {
        $cacheKey = 'weather_current_' . strtolower(str_replace(' ', '_', $city));

        return Cache::remember($cacheKey, $this->cacheTtl, function () use ($city) {
            $response = Http::retry(3, 100)
                ->get("{$this->baseUrl}/weather", [
                    'q' => $city,
                    'appid' => $this->apiKey,
                    'units' => $this->units,
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

            return (new WeatherData($data))->toArray();
        });
    }

    /**
     * Get 5-day forecast by city name
     */
    public function getForecastByCity(string $city): array
    {
        $cacheKey = 'weather_forecast_' . strtolower(str_replace(' ', '_', $city));

        return Cache::remember($cacheKey, $this->cacheTtl, function () use ($city) {
            $response = Http::retry(3, 100)
                ->get("{$this->baseUrl}/forecast", [
                    'q' => $city,
                    'appid' => $this->apiKey,
                    'units' => $this->units,
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

            return [
                'city' => $data['city'],
                'forecast' => $this->transformForecastData($data['list']),
            ];
        });
    }

    /**
     * Get weather by geographic coordinates
     */
    public function getWeatherByCoordinates(float $lat, float $lon): array
    {
        $cacheKey = "weather_geo_{$lat}_{$lon}";

        return Cache::remember($cacheKey, $this->cacheTtl, function () use ($lat, $lon) {
            $response = Http::retry(3, 100)
                ->get("{$this->baseUrl}/weather", [
                    'lat' => $lat,
                    'lon' => $lon,
                    'appid' => $this->apiKey,
                    'units' => $this->units,
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

            return (new WeatherData($data))->toArray();
        });
    }

    /**
     * Transform forecast into daily buckets
     */
    protected function transformForecastData(array $forecastList): array
    {
        $groupedForecast = [];

        foreach ($forecastList as $item) {
            $timestamp = $item['dt'];
            $date = date('Y-m-d', $timestamp);

            if (!isset($groupedForecast[$date])) {
                $groupedForecast[$date] = [
                    'date' => $date,
                    'day_name' => date('l', $timestamp),
                    'items' => []
                ];
            }

            $groupedForecast[$date]['items'][] = [
                'time' => date('H:i', $timestamp),
                'temp' => $item['main']['temp'] ?? null,
                'feels_like' => $item['main']['feels_like'] ?? null,
                'humidity' => $item['main']['humidity'] ?? null,
                'description' => $item['weather'][0]['description'] ?? '',
                'icon' => $item['weather'][0]['icon'] ?? '01d',
                'wind_speed' => $item['wind']['speed'] ?? null,
                'wind_direction' => $item['wind']['deg'] ?? null,
                'clouds' => $item['clouds']['all'] ?? null,
                'precipitation' => $item['pop'] ?? 0,
            ];
        }

        return array_values($groupedForecast);
    }
}
