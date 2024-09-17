<template>
  <div class="grid-container">
    <div class="search-history">
      <ul>
        <li v-for="search in searches" :key="search.date" @click="fetchWeather(search.city)">
          {{ search.city }} - {{ search.date }}
        </li>
      </ul>
    </div>
    <div id="map-history"></div>
    <div class="forecast"></div>
  </div>
</template>

<script lang="ts">
import L from 'leaflet';
import { getFiveDayForecast, type Forecast } from '@/services/weatherService';
import { useHistoryStore } from '../stores/history';

export default {
  data() {
    return {
      forecastData: null as Forecast | null,
      map: null as L.Map | null,
      marker: null as L.Marker | null,
      loading: false
    };
  },
  mounted() {
    this.initializeMap();
    window.addEventListener('resize', this.onResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize);
  },
  computed: {
    searches() {
      const historyStore = useHistoryStore();
      return historyStore.searches;
    }
  },
  methods: {
    initializeMap() {
      // Initialize the map with default coordinates
      this.map = L.map('map-history').setView([51.505, -0.09], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      this.marker = L.marker([51.505, -0.09]).addTo(this.map);

      // Invalidate size to make sure map is rendered correctly
      this.$nextTick(() => {
        this.map?.invalidateSize();
      });
    },
    async fetchWeather(city: string) {
      this.loading = true;
      try {
        const forecastData = await getFiveDayForecast(city, this.$i18n.locale);
        this.forecastData = forecastData;

        // Extract coordinates from the weather data
        const { lat, lon } = forecastData.data.city.coord;

        // Update the map's view to the city's coordinates
        if (this.map) {
          this.map.setView([lat, lon], 14);

          // Update the marker position
          if (this.marker) {
            this.marker.setLatLng([lat, lon]);
          }
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.error('Error fetching weather:', error);
      }
    },
    getWeatherIcon(icon: string) {
      return `http://openweathermap.org/img/wn/${icon}@2x.png`;
    },
    onResize() {
      // Invalidate the map size on window resize
      this.map?.invalidateSize();
    }
  }
};
</script>

<style>
.grid-container {
  padding: 60px 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  column-gap: 14px;
  row-gap: 24px;
  align-content: center;
  justify-content: center;
}
.search-history {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
  background-color: lightblue;
  border-radius: 20px;
}
#map-history {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
  border-radius: 20px;
  min-height: 700px;
}
.forecast-history {
  grid-column: 1 / 3;
  grid-row: 2 / 3;
  background-color: lightgreen;
}
</style>
