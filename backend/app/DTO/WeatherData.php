<?php

namespace App\DTO;

class WeatherData
{
    protected array $data;

    public function __construct(array $apiData)
    {
        $this->data = $apiData;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->data['id'] ?? null,
            'name' => $this->data['name'] ?? null,
            'country' => $this->data['sys']['country'] ?? null,
            'coordinates' => [
                'lat' => $this->data['coord']['lat'] ?? null,
                'lon' => $this->data['coord']['lon'] ?? null,
            ],
            'timezone' => $this->data['timezone'] ?? null,
            'dt' => $this->data['dt'] ?? null,
            'timestamp' => now()->setTimestamp($this->data['dt'] ?? time())->toDateTimeString(),

            'weather' => [
                'id' => $this->data['weather'][0]['id'] ?? null,
                'main' => $this->data['weather'][0]['main'] ?? null,
                'description' => $this->data['weather'][0]['description'] ?? null,
                'icon' => $this->data['weather'][0]['icon'] ?? null,
                'icon_url' => isset($this->data['weather'][0]['icon']) 
                    ? "https://openweathermap.org/img/wn/{$this->data['weather'][0]['icon']}@2x.png"
                    : null,
            ],

            // ✅ STRUCTURE TO MATCH FRONTEND
            'temperature' => [
                'current' => $this->data['main']['temp'] ?? null,
                'feels_like' => $this->data['main']['feels_like'] ?? null,
                'min' => $this->data['main']['temp_min'] ?? null,
                'max' => $this->data['main']['temp_max'] ?? null,
            ],

            'pressure' => $this->data['main']['pressure'] ?? null,
            'humidity' => $this->data['main']['humidity'] ?? null,
            'visibility' => $this->data['visibility'] ?? null,

            'wind' => [
                'speed' => $this->data['wind']['speed'] ?? null,
                'deg' => $this->data['wind']['deg'] ?? null,
                'direction' => $this->getWindDirection($this->data['wind']['deg'] ?? 0),
                'gust' => $this->data['wind']['gust'] ?? null,
            ],

            'clouds' => [
                'all' => $this->data['clouds']['all'] ?? null,
            ],

            'rain' => $this->data['rain'] ?? null,
            'snow' => $this->data['snow'] ?? null,

            'sys' => $this->data['sys'] ?? [],
            'sunrise' => $this->data['sys']['sunrise'] ?? null,
            'sunset' => $this->data['sys']['sunset'] ?? null,
            'sunrise_formatted' => isset($this->data['sys']['sunrise']) 
                ? gmdate('H:i', $this->data['sys']['sunrise'] + ($this->data['timezone'] ?? 0)) 
                : null,
            'sunset_formatted' => isset($this->data['sys']['sunset']) 
                ? gmdate('H:i', $this->data['sys']['sunset'] + ($this->data['timezone'] ?? 0)) 
                : null,
        ];
    }

    /**
     * Convert degree to compass direction
     */
    protected function getWindDirection(float $deg): string
    {
        $directions = [
            'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
            'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
        ];
        $index = (int) (($deg / 22.5) + 0.5) % 16;
        return $directions[$index];
    }
}
