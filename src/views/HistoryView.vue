<template>
  <div class="grid-container">
    <div class="search-history">
      <h4 style="padding: 10px" v-if="!searches.length">
        {{ $t('searchHistoryEmpty') }}
      </h4>
      <div v-for="search in searches" :key="search.date" @click="fetchWeather(search.city)">
        <p style="background-color: gray; padding: 2px 6px; border-radius: 20px; cursor: pointer">
          {{ search.city }} - {{ search.date }}
        </p>
      </div>
      <button
        style="
          width: fit-content;
          cursor: pointer;
          border: none;
          outline: unset;
          background-color: transparent;
        "
      >
        {{ $t('resetHistory') }}
      </button>
    </div>
    <div id="map-history"></div>
    <div class="forecast" v-if="!forecastData">
      <h2 style="align-self: center; margin: 0 auto">
        {{ $t('searchFirst') }}
      </h2>
    </div>
    <div class="forecast forecast-grid" v-if="forecastData">
      <div class="weather-card" v-for="forecast in forecastData.data.list" :key="forecast.dt">
        <h2
          style="background-color: grey; width: fit-content; padding: 2px 10px; border-radius: 20px"
        >
          {{ formatDate(forecast.dt_txt) }}
        </h2>
        <div style="display: flex; align-items: center; width: fit-content; gap: 16px">
          <div
            style="
              display: flex;
              flex-direction: column;
              align-items: center;
              width: fit-content;
              gap: 4px;
            "
          >
            <img
              style="background-color: gray; border-radius: 20px"
              :src="getWeatherIcon(forecast.weather[0].icon)"
              alt="Weather Icon"
            />
            <h3 style="background-color: gray; border-radius: 20px; padding: 2px 16px">
              {{ forecast.weather[0].main }}
            </h3>
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              align-items: center;
              width: fit-content;
              gap: 16px;
              background-color: gray;
              padding: 12px;
              border-radius: 20px;
            "
          >
            <h2>{{ forecast.main.temp }} °C</h2>
            <h4>{{ forecast.main.temp_min }} / {{ forecast.main.temp_max }} °C</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import L from 'leaflet';
import { getFiveDayForecast, type Forecast } from '@/services/weatherService';
import { useHistoryStore } from '../stores/history';
import moment from 'moment';

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
      this.map = L.map('map-history').setView([51.505, -0.09], 12);

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
    },
    formatDate(date: string) {
      return moment(date).locale(this.$i18n.locale).format('MMMM, DD');
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
  border: 2px solid gray;
  border-radius: 30px;
  display: flex;
  gap: 12px;
  overflow: auto;
  justify-content: space-between;
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
