<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\WeatherRequest;
use App\Services\WeatherService;
use Illuminate\Http\JsonResponse;

class WeatherController extends Controller
{
    protected $weatherService;

    /**
     * Create a new controller instance.
     *
     * @param WeatherService $weatherService
     */
    public function __construct(WeatherService $weatherService)
    {
        $this->weatherService = $weatherService;
    }

    /**
     * Get current weather data by city name
     *
     * @param WeatherRequest $request
     * @return JsonResponse
     */
    public function getCurrentWeather(WeatherRequest $request): JsonResponse
    {
        $city = $request->input('city');
        
        try {
            $weatherData = $this->weatherService->getCurrentWeatherByCity($city);
            return response()->json($weatherData);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch weather data',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get weather forecast by city name
     *
     * @param WeatherRequest $request
     * @return JsonResponse
     */
    public function getForecast(WeatherRequest $request): JsonResponse
    {
        $city = $request->input('city');
        
        try {
            $forecastData = $this->weatherService->getForecastByCity($city);
            return response()->json($forecastData);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch forecast data',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get weather data by geographic coordinates
     *
     * @param WeatherRequest $request
     * @return JsonResponse
     */
    public function getWeatherByCoordinates(WeatherRequest $request): JsonResponse
    {
        $lat = $request->input('lat');
        $lon = $request->input('lon');
        
        try {
            $weatherData = $this->weatherService->getWeatherByCoordinates($lat, $lon);
            return response()->json($weatherData);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch weather data',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}