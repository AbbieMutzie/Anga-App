# Weather App Frontend

This is a weather application frontend built with Next.js and TypeScript. It connects to a Laravel backend API to fetch weather data from OpenWeatherMap.

## Features

- Search weather by city name
- Get weather based on user's current location
- View current weather conditions
- View 5-day weather forecast
- Responsive design using RippleUI components

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- RippleUI Components
- Fetch API for AJAX requests

## Prerequisites

- Node.js 16.8 or later
- Laravel backend running (see backend repository)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/weather-app-frontend.git
   cd weather-app-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```
   BACKEND_URL=http://localhost:8000/api
   ```

   > Note: Update the `BACKEND_URL` to match your Laravel backend API URL.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit [http://localhost:3000](http://localhost:3000)

## Building for Production

```bash
npm run build
npm run start
```

## Project Structure

```
weather-app-frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Layout.tsx
│   │   ├── weather/
│   │   │   ├── CurrentWeather.tsx
│   │   │   ├── ForecastWeather.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── WeatherCard.tsx
│   │   │   └── WeatherDetails.tsx
│   ├── hooks/
│   │   └── useWeather.ts
│   ├── interfaces/
│   │   └── weather.ts
│   ├── services/
│   │   └── weatherService.ts
│   ├── utils/
│   │   └── helpers.ts
│   ├── styles/
│   │   └── globals.css
│   └── pages/
│       ├── _app.tsx
│       ├── _document.tsx
│       └── index.tsx
├── .env.local
├── next.config.js
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── README.md
```

## API Endpoints

The frontend connects to the following backend API endpoints:

- `GET /api/weather?city={city}` - Get current weather by city name
- `GET /api/forecast?city={city}` - Get 5-day forecast by city name
- `GET /api/weather/coordinates?lat={lat}&lon={lon}` - Get current weather by coordinates
- `GET /api/forecast/coordinates?lat={lat}&lon={lon}` - Get 5-day forecast by coordinates

## License
