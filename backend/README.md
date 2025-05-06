# Weather App Backend (Laravel)

This is the backend component of a decoupled Weather Application. It provides a Laravel-based API that interacts with the OpenWeatherMap API to fetch weather data and serves it to the frontend.

## Features

- Current weather data by city name
- 5-day weather forecast
- Weather lookup by geographic coordinates
- Data transformation and standardization
- Response caching to improve performance
- Error handling and validation
- CORS configuration for cross-origin requests

## Requirements

- PHP 8.1+
- Composer
- Laravel 10.x
- OpenWeatherMap API key

## Project Structure

```
weather-app-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── API/
│   │   │   │   └── WeatherController.php  # API endpoints
│   │   ├── Middleware/
│   │   └── Requests/
│   │       └── WeatherRequest.php         # Input validation
│   ├── Services/
│   │   └── WeatherService.php             # Business logic
│   ├── DTO/
│   │   └── WeatherData.php                # Data transformation
├── config/
│   ├── app.php
│   ├── services.php                       # API key config
│   └── cors.php                           # CORS settings
├── routes/
│   └── api.php                            # API routes
├── tests/
│   ├── Feature/
│   │   └── WeatherApiTest.php             # API tests
│   └── Unit/
│       └── WeatherServiceTest.php         # Service tests
├── .env.example
├── composer.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/weather-app-backend.git
   cd weather-app-backend
   ```

2. Install dependencies:
   ```
   composer install
   ```

3. Create an environment file:
   ```
   cp .env.example .env
   ```

4. Generate an application key:
   ```
   php artisan key:generate
   ```

5. Add your OpenWeatherMap API key to the `.env` file:
   ```
   OPENWEATHERMAP_API_KEY=your_api_key_here
   ```

6. Start the development server:
   ```
   php artisan serve
   ```

## API Endpoints

### Current Weather

```
GET /api/weather/current
```

Parameters:
- `city` (required): City name, e.g., "London", "New York"

### Weather Forecast

```
GET /api/weather/forecast
```

Parameters:
- `city` (required): City name, e.g., "London", "New York"

### Weather by Coordinates

```
GET /api/weather/coordinates
```

Parameters:
- `lat` (required): Latitude (-90 to 90)
- `lon` (required): Longitude (-180 to 180)

## Testing

Run the test suite with:

```
php artisan test
```

## OpenWeatherMap API

This application uses the [OpenWeatherMap API](https://openweathermap.org/api) to fetch weather data. The following endpoints are used:

- Current Weather: `api.openweathermap.org/data/2.5/weather`
- 5-day Forecast: `api.openweathermap.org/data/2.5/forecast`

You'll need to [sign up](https://home.openweathermap.org/users/sign_up) for a free API key to use this application.

## Frontend Integration

This backend is designed to work with the NextJS frontend available in the companion repository. The frontend will make AJAX requests to these API endpoints to display weather information.

## License

This project is open-sourced software licensed under the MIT license.