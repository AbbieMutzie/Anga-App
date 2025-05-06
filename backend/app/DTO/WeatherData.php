<?php

namespace App\DTO;

/**
 * Weather Data Transfer Object
 * Standardizes and transforms the raw API response to a consistent format
 */
class WeatherData
{
    /**
     * Raw data from API
     *
     * @var array
     */
    protected $data;
    
    /**
     * Create a new DTO instance
     *
     * @param array $data
     */
    public function __construct(array $data)
    {
        $this->data = $data;
    }
    
    /**
     * Transform and standardize weather data
     *
     * @return array
     */
    public function toArray(): array
    {
        // Basic location information
        $result = [
            'id' => $this->data['id'],
            'name' => $this->data['name'],
            'country' => $this->data['sys']['country'] ?? null,
            'coordinates' => [
                'lat' => $this->data['coord']['lat'],
                'lon' => $this->data['coord']['lon'],
            ],
            'timezone' => $this->data['timezone'],
            'dt' => $this->data['dt'],
            'timestamp' => date('Y-m-d H:i:s', $this->data['dt']),
        ];
        
        // Weather conditions
        $result['weather'] = [
            'id' => $this->data['weather'][0]['id'],
            'main' => $this->data['weather'][0]['main'],
            'description' => $this->data['weather'][0]['description'],
            'icon' => $this->data['weather'][0]['icon'],
            'icon_url' => "https://openweathermap.org/img/wn/{$this->data['weather'][0]['icon']}@2x.png",
        ];
        
        // Main weather metrics
        $result['main'] = [
            'temp' => $this->data['main']['temp'],
            'feels_like' => $this->data['main']['feels_like'],
            'temp_min' => $this->data['main']['temp_min'],
            'temp_max' => $this->data['main']['temp_max'],
            'pressure' => $this->data['main']['pressure'],
            'humidity' => $this->data['main']['humidity'],
        ];
        
        // Wind information
        $result['wind'] = [
            'speed' => $this->data['wind']['speed'],
            'deg' => $this->data['wind']['deg'],
            'direction' => $this->getWindDirection($this->data['wind']['deg']),
            'gust' => $this->data['wind']['gust'] ?? null,
        ];
        
        // Additional data
        $result['clouds'] = $this->data['clouds'] ?? null;
        $result['rain'] = $this->data['rain'] ?? null;
        $result['snow'] = $this->data['snow'] ?? null;
        
        // Sunrise and sunset
        if (isset($this->data['sys']['sunrise']) && isset($this->data['sys']['sunset'])) {
            $result['sys'] = [
                'sunrise' => $this->data['sys']['sunrise'],
                'sunset' => $this->data['sys']['sunset'],
                'sunrise_formatted' => date('H:i', $this->data['sys']['sunrise']),
                'sunset_formatted' => date('H:i', $this->data['sys']['sunset']),
            ];
        }
        
        return $result;
    }
    
    /**
     * Get cardinal direction from degrees
     *
     * @param int $deg
     * @return string
     */
    protected function getWindDirection(int $deg): string
    {
        $directions = [
            'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
            'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'
        ];
        
        return $directions[round($deg / 22.5)];
    }
}