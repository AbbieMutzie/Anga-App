<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\WeatherController;

// ✅ This route must be OUTSIDE the weather prefix group
Route::get('/test-weather', function () {
    return response()->json(['message' => '✅ Weather API is running!']);
});

// Weather API Routes
Route::prefix('weather')->group(function () {
    Route::get('/current', [WeatherController::class, 'getCurrentWeather']);
    Route::get('/forecast', [WeatherController::class, 'getForecast']);
    Route::get('/coordinates', [WeatherController::class, 'getWeatherByCoordinates']);
});
