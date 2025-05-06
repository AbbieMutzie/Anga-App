<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\WeatherController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| API routes can be registered for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. 
|
*/

// Weather API Routes
Route::prefix('weather')->group(function () {
    Route::get('/current', [WeatherController::class, 'getCurrentWeather']);
    Route::get('/forecast', [WeatherController::class, 'getForecast']);
    Route::get('/coordinates', [WeatherController::class, 'getWeatherByCoordinates']);
});