import { getFiveDayForecast, type Forecast } from '@/services/weatherService';
import type { Map, Marker } from 'leaflet';

export const fetchWeather = async (
  loading: { value: boolean },
  city: string,
  locale: string,
  forecast: { value: Forecast | null },
  map: { value: Map | null },
  marker: { value: Marker | null },
  addSearch?: (val: { city: string; date: string }) => void
) => {
  loading.value = true;
  try {
    const forecastData = await getFiveDayForecast(city, locale);
    forecast.value = forecastData;

    // Extract coordinates from the weather data
    const { lat, lon } = forecastData.data.city.coord;

    // Update the map's view to the city's coordinates
    if (map.value) {
      map.value.setView([lat, lon], 14);

      // Update the marker position
      if (marker.value) {
        marker.value.setLatLng([lat, lon]);
      }
    }

    // Save search to history
    if (addSearch) {
      addSearch({ city: city, date: new Date().toLocaleString() });
    }

    loading.value = false;
  } catch (error) {
    loading = false;
    console.error('Error fetching weather:', error);
  }
};
