<?php

namespace Tests\Unit;

use App\Services\WeatherService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class WeatherServiceTest extends TestCase
{
    /**
     * @var WeatherService
     */
    protected $weatherService;

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
        
        // Clear cache before each test
        Cache::flush();
        
        // Create instance of the service
        $this->weatherService = new WeatherService();
    }
    
    /**
     * Test fetching current weather data by city name.
     *
     * @return void
     */
    public function test_get_current_weather_by_city()
    {
        // Mock HTTP response
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
        
        // Call the service method
        $result = $this->weatherService->getCurrentWeatherByCity('London');
        
        // Assert response structure
        $this->assertIsArray($result);
        $this->assertArrayHasKey('id', $result);
        $this->assertArrayHasKey('name', $result);
        $this->assertArrayHasKey('weather', $result);
        $this->assertArrayHasKey('main', $result);
        
        // Assert data transformation
        $this->assertEquals('London', $result['name']);
        $this->assertEquals('GB', $result['country']);
        $this->assertEquals('clear sky', $result['weather']['description']);
        $this->assertEquals(15.5, $result['main']['temp']);
        
        // Verify that wind direction is correctly calculated
        $this->assertEquals('NW', $result['wind']['direction']);
    }
    
    /**
     * Test fetching forecast data by city name.
     *
     * @return void
     */
    public function test_get_forecast_by_city()
    {
        // Build a sample forecast response
        $forecastResponse = [
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
                // Day 1
                [
                    'dt' => strtotime('today 09:00'),
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
                // Day 1 - Later
                [
                    'dt' => strtotime('today 12:00'),
                    'main' => [
                        'temp' => 18.5,
                        'feels_like' => 17.8,
                        'humidity' => 65,
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
                        'speed' => 3.5,
                        'deg' => 315
                    ],
                    'clouds' => [
                        'all' => 10
                    ],
                    'pop' => 0
                ],
                // Day 2
                [
                    'dt' => strtotime('tomorrow 09:00'),
                    'main' => [
                        'temp' => 17.0,
                        'feels_like' => 16.5,
                        'humidity' => 68,
                    ],
                    'weather' => [
                        [
                            'id' => 801,
                            'main' => 'Clouds',
                            'description' => 'few clouds',
                            'icon' => '02d'
                        ]
                    ],
                    'wind' => [
                        'speed' => 4.0,
                        'deg' => 300
                    ],
                    'clouds' => [
                        'all' => 20
                    ],
                    'pop' => 0.1
                ],
            ]
        ];
        
        // Mock HTTP response
        Http::fake([
            'api.openweathermap.org/data/2.5/forecast*' => Http::response($forecastResponse, 200)
        ]);
        
        // Call the service method
        $result = $this->weatherService->getForecastByCity('London');
        
        // Assert response structure
        $this->assertIsArray($result);
        $this->assertArrayHasKey('city', $result);
        $this->assertArrayHasKey('forecast', $result);
        
        // Assert forecast transformation
        $this->assertCount(2, $result['forecast']); // Should have 2 days
        $this->assertEquals(date('Y-m-d'), $result['forecast'][0]['date']);
        $this->assertEquals(date('Y-m-d', strtotime('tomorrow')), $result['forecast'][1]['date']);
        
        // Assert items for day 1
        $this->assertCount(2, $result['forecast'][0]['items']); // 2 entries for today
        $this->assertEquals('09:00', $result['forecast'][0]['items'][0]['time']);
        $this->assertEquals(16.2, $result['forecast'][0]['items'][0]['temp']);
        
        // Assert items for day 2
        $this->assertCount(1, $result['forecast'][1]['items']); // 1 entry for tomorrow
        $this->assertEquals('few clouds', $result['forecast'][1]['items'][0]['description']);
    }
    
    /**
     * Test fetching weather by coordinates.
     *
     * @return void
     */
    public function test_get_weather_by_coordinates()
    {
        // Mock HTTP response
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
        
        // Call the service method
        $result = $this->weatherService->getWeatherByCoordinates(51.5074, -0.1278);
        
        // Assert response structure
        $this->assertIsArray($result);
        $this->assertArrayHasKey('id', $result);
        $this->assertArrayHasKey('name', $result);
        $this->assertArrayHasKey('coordinates', $result);
        
        // Assert coordinates are preserved
        $this->assertEquals(51.5074, $result['coordinates']['lat']);
        $this->assertEquals(-0.1278, $result['coordinates']['lon']);
    }
    
    /**
     * Test error handling when API call fails.
     *
     * @return void
     */
    public function test_error_handling()
    {
        // Mock HTTP response with error
        Http::fake([
            'api.openweathermap.org/data/2.5/weather*' => Http::response([
                'cod' => '404',
                'message' => 'city not found'
            ], 404)
        ]);
        
        // Expect exception
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('city not found');
        
        // Call service method which should throw exception
        $this->weatherService->getCurrentWeatherByCity('NonExistentCity12345');
    }
    
    /**
     * Test that responses are cached.
     *
     * @return void
     */
    public function test_caching()
    {
        // Create a unique city name to ensure cache control
        $city = 'TestCity' . rand(1000, 9999);
        
        // Mock HTTP response
        Http::fake([
            'api.openweathermap.org/data/2.5/weather*' => Http::response([
                'id' => 1234,
                'name' => $city,
                'coord' => [
                    'lat' => 40.7128,
                    'lon' => -74.0060
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
                    'temp' => 20.5,
                    'feels_like' => 19.8,
                    'temp_min' => 19.0,
                    'temp_max' => 22.0,
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
                    'country' => 'US',
                    'sunrise' => 1621737067,
                    'sunset' => 1621793773
                ],
                'timezone' => 3600,
            ], 200)
        ]);
        
        // First call should hit the API
        $result1 = $this->weatherService->getCurrentWeatherByCity($city);
        
        // Change the mock response to verify we're getting cached data
        Http::fake([
            'api.openweathermap.org/data/2.5/weather*' => Http::response([
                'id' => 1234,
                'name' => $city,
                'weather' => [
                    [
                        'id' => 500,
                        'main' => 'Rain',
                        'description' => 'light rain',
                        'icon' => '10d'
                    ]
                ],
                // Other fields would be here...
            ], 200)
        ]);
        
        // Second call should return the cached response, not the new mock
        $result2 = $this->weatherService->getCurrentWeatherByCity($city);
        
        // Both results should be identical since second call uses cache
        $this->assertEquals($result1, $result2);
        $this->assertEquals('clear sky', $result2['weather']['description']);
        
        // Verify HTTP was only called once
        Http::assertSentCount(1);
    }
}