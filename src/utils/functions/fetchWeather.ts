import { getFiveDayForecast, type Forecast } from '@/services/weatherService';
import type { Map, Marker } from 'leaflet';

export const fetchWeather = async (
  loading: { value: boolean },
  city: string,
  locale: string,
  forecast: { value: Forecast | null },
  map: Map | null,
  marker: Marker | null,
  addSearch?: (val: { city: string; date: string }) => void
) => {
  loading.value = true;
  try {
    const forecastData = await getFiveDayForecast(city, locale);
    forecast.value = forecastData;

    // Extract coordinates from the weather data
    const { lat, lon } = forecastData.data.city.coord;

    // Update the map's view to the city's coordinates
    if (map) {
      map.setView([lat, lon], 12);

      // Update the marker position
      if (marker) {
        marker.setLatLng([lat, lon]);
      }
    }

    // Save search to history
    if (addSearch) {
      addSearch({ city: forecastData.data.city.name, date: new Date().toLocaleString() });
    }

    loading.value = false;
  } catch (error) {
    loading.value = false;
    console.error('Error fetching weather:', error);
  }
};
