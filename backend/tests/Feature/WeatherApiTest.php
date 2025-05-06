<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class WeatherApiTest extends TestCase
{
    /**
     * Setup the test environment.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        
        // Mock the HTTP client to prevent actual API calls during testing
        Http::preventStrayRequests();
    }
    
    /**
     * Test current weather endpoint with valid city.
     *
     * @return void
     */
    public function test_current_weather_endpoint_with_valid_city()
    {
        // Mock the HTTP response from OpenWeatherMap API
        Http::fake([
            'api.openweathermap.org/data/2.5/weather*' => Http::response([
                'id' => 2643743,
                'name' => 'London',
                'coord' => [
                    'lat' => 51.5074,
                    'lon' => -0.1278
                ],
                'weather' => [
                    [
                        'id' => 800,
                        'main' => 'Clear',
                        'description' => 'clear sky',
                        'icon' => '01d'
                    ]
                ],
                'main' => [
                    'temp' => 15.5,
                    'feels_like' => 14.8,
                    'temp_min' => 14.0,
                    'temp_max' => 17.0,
                    'pressure' => 1020,
                    'humidity' => 76
                ],
                'wind' => [
                    'speed' => 3.6,
                    'deg' => 320
                ],
                'clouds' => [
                    'all' => 0
                ],
                'dt' => 1621766400,
                'sys' => [
                    'country' => 'GB',
                    'sunrise' => 1621737067,
                    'sunset' => 1621793773
                ],
                'timezone' => 3600,
            ], 200)
        ]);
        
        // Make request to our API endpoint
        $response = $this->getJson('/api/weather/current?city=London');
        
        // Assert response
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'id',
                     'name',
                     'country',
                     'coordinates' => ['lat', 'lon'],
                     'weather' => ['id', 'main', 'description', 'icon', 'icon_url'],
                     'main' => ['temp', 'feels_like', 'humidity'],
                     'wind' => ['speed', 'deg', 'direction'],
                 ]);
    }
    
    /**
     * Test current weather endpoint with invalid city.
     *
     * @return void
     */
    public function test_current_weather_endpoint_with_invalid_city()
    {
        // Mock the HTTP response for invalid city
        Http::fake([
            'api.openweathermap.org/data/2.5/weather*' => Http::response([
                'cod' => '404',
                'message' => 'city not found'
            ], 404)
        ]);
        
        // Make request with invalid city
        $response = $this->getJson('/api/weather/current?city=NonExistentCity12345');
        
        // Assert error response
        $response->assertStatus(500)
                 ->assertJson([
                     'error' => 'Failed to fetch weather data',
                     'message' => 'city not found'
                 ]);
    }
    
    /**
     * Test weather forecast endpoint.
     *
     * @return void
     */
    public function test_forecast_endpoint()
    {
        // Mock the HTTP response for forecast
        Http::fake([
            'api.openweathermap.org/data/2.5/forecast*' => Http::response([
                'city' => [
                    'id' => 2643743,
                    'name' => 'London',
                    'coord' => [
                        'lat' => 51.5074,
                        'lon' => -0.1278
                    ],
                    'country' => 'GB',
                ],
                'list' => [
                    [
                        'dt' => 1621778400,
                        'main' => [
                            'temp' => 16.2,
                            'feels_like' => 15.6,
                            'humidity' => 70,
                        ],
                        'weather' => [
                            [
                                'id' => 800,
                                'main' => 'Clear',
                                'description' => 'clear sky',
                                'icon' => '01d'
                            ]
                        ],
                        'wind' => [
                            'speed' => 3.1,
                            'deg' => 310
                        ],
                        'clouds' => [
                            'all' => 5
                        ],
                        'pop' => 0
                    ],
                    // Additional forecast entries would be here
                ]
            ], 200)
        ]);
        
        // Make request to forecast endpoint
        $response = $this->getJson('/api/weather/forecast?city=London');
        
        // Assert response
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'city',
                     'forecast' => [
                         '*' => [
                             'date',
                             'day_name',
                             'items' => [
                                 '*' => [
                                     'time',
                                     'temp',
                                     'feels_like',
                                     'description',
                                     'icon',
                                 ]
                             ]
                         ]
                     ]
                 ]);
    }
    
    /**
     * Test weather by coordinates endpoint.
     * 
     * @return void
     */
    public function test_weather_by_coordinates_endpoint()
    {
        // Mock the HTTP response for weather by coordinates
        Http::fake([
            'api.openweathermap.org/data/2.5/weather*' => Http::response([
                'id' => 2643743,
                'name' => 'London',
                'coord' => [
                    'lat' => 51.5074,
                    'lon' => -0.1278
                ],
                'weather' => [
                    [
                        'id' => 800,
                        'main' => 'Clear',
                        'description' => 'clear sky',
                        'icon' => '01d'
                    ]
                ],
                'main' => [
                    'temp' => 15.5,
                    'feels_like' => 14.8,
                    'temp_min' => 14.0,
                    'temp_max' => 17.0,
                    'pressure' => 1020,
                    'humidity' => 76
                ],
                'wind' => [
                    'speed' => 3.6,
                    'deg' => 320
                ],
                'clouds' => [
                    'all' => 0
                ],
                'dt' => 1621766400,
                'sys' => [
                    'country' => 'GB',
                    'sunrise' => 1621737067,
                    'sunset' => 1621793773
                ],
                'timezone' => 3600,
            ], 200)
        ]);
        
        // Make request with coordinates
        $response = $this->getJson('/api/weather/coordinates?lat=51.5074&lon=-0.1278');
        
        // Assert response
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'id',
                     'name',
                     'country',
                     'coordinates' => ['lat', 'lon'],
                     'weather' => ['id', 'main', 'description', 'icon'],
                     'main' => ['temp', 'feels_like', 'humidity'],
                 ]);
    }
    
    /**
     * Test validation errors.
     *
     * @return void
     */
    public function test_validation_errors()
    {
        // Test missing city parameter
        $response = $this->getJson('/api/weather/current');
        $response->assertStatus(422);
        
        // Test invalid coordinates
        $response = $this->getJson('/api/weather/coordinates?lat=invalid&lon=-0.1278');
        $response->assertStatus(422);
        
        // Test out of range coordinates
        $response = $this->getJson('/api/weather/coordinates?lat=95&lon=-0.1278');
        $response->assertStatus(422);
    }
}