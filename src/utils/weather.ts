import { WeatherData } from '../types/clock';

export async function fetchLiveWeather(city = 'New York'): Promise<WeatherData> {
  // Coordinates for popular cities
  const coords: Record<string, { lat: number; lon: number; name: string }> = {
    'New York': { lat: 40.7128, lon: -74.006, name: 'New York' },
    'London': { lat: 51.5074, lon: -0.1278, name: 'London' },
    'Tokyo': { lat: 35.6762, lon: 139.6503, name: 'Tokyo' },
    'Karachi': { lat: 24.8607, lon: 67.0011, name: 'Karachi' },
    'Dubai': { lat: 25.2048, lon: 55.2708, name: 'Dubai' },
    'Paris': { lat: 48.8566, lon: 2.3522, name: 'Paris' },
  };

  const selected = coords[city] || coords['New York'];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${selected.lat}&longitude=${selected.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      const current = data.current;
      const code = current?.weather_code ?? 0;

      let condition = 'Clear Sky';
      let icon: WeatherData['icon'] = 'sun';

      if (code === 0) {
        condition = 'Clear';
        icon = 'sun';
      } else if (code >= 1 && code <= 3) {
        condition = 'Partly Cloudy';
        icon = 'cloud';
      } else if (code >= 51 && code <= 67) {
        condition = 'Light Rain';
        icon = 'rain';
      } else if (code >= 71 && code <= 77) {
        condition = 'Snowing';
        icon = 'snow';
      } else if (code >= 95) {
        condition = 'Thunderstorm';
        icon = 'storm';
      }

      return {
        city: selected.name,
        temp: Math.round(current.temperature_2m),
        condition,
        humidity: Math.round(current.relative_humidity_2m || 45),
        windSpeed: Math.round(current.wind_speed_10m || 12),
        icon,
        high: Math.round(data.daily?.temperature_2m_max?.[0] || current.temperature_2m + 4),
        low: Math.round(data.daily?.temperature_2m_min?.[0] || current.temperature_2m - 5),
      };
    }
  } catch {
    // Graceful fallback
  }

  return {
    city: selected.name,
    temp: 21,
    condition: 'Clear Sky',
    humidity: 48,
    windSpeed: 10,
    icon: 'sun',
    high: 25,
    low: 16,
  };
}
