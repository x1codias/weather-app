<template>
  <div class="grid-container-home">
    <div class="search">
      <input
        class="search-input"
        v-model="city"
        :placeholder="$t('searchCity')"
        @keyup.enter="fetchWeather"
        :disabled="loading"
      />
      <button class="search-btn" :disabled="loading" @click="fetchWeather">
        <v-icon name="fa-search" />
      </button>
    </div>
    <div id="map"></div>
    <div class="forecast"></div>
    <div class="forecast" v-if="forecastData">
      <ul>
        <li v-for="forecast in forecastData.data.list" :key="forecast.dt">
          <img :src="getWeatherIcon(forecast.weather[0].icon)" alt="Weather Icon" />
          <p>{{ forecast.dt_txt }} - {{ forecast.main.temp }}°C</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import L from 'leaflet';
import { getFiveDayForecast, type Forecast } from '../services/weatherService';
import { useHistoryStore } from '../stores/history';
import moment from 'moment';
import { OhVueIcon } from 'oh-vue-icons';

export default {
  components: {
    'v-icon': OhVueIcon
  },
  data() {
    return {
      city: '',
      forecastData: null as Forecast | null,
      map: null as L.Map | null,
      marker: null as L.Marker | null,
      today: '',
      loading: false
    };
  },
  mounted() {
    this.initializeMap();
    window.addEventListener('resize', this.onResize);
    this.today = `${moment().locale(this.$i18n.locale).format('dddd')},  ${moment().weekday()}`;
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    initializeMap() {
      // Initialize the map with default coordinates
      this.map = L.map('map').setView([51.505, -0.09], 13);

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
    async fetchWeather() {
      this.loading = true;
      try {
        const forecastData = await getFiveDayForecast(this.city, this.$i18n.locale);
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

        // Save search to history
        const historyStore = useHistoryStore();
        historyStore.addSearch({ city: this.city, date: new Date().toLocaleString() });
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
.grid-container-home {
  padding: 60px 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  column-gap: 14px;
  row-gap: 24px;
  align-content: center;
  justify-content: center;
}
.search {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  height: fit-content;
  display: flex;
  align-items: center;
  gap: 12px;
}
#map {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
  border-radius: 20px;
  min-height: 700px;
}
.forecast {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  max-height: 700px;
  overflow: auto;
}
.search-input {
  width: 40%;
  height: fit-content;
  outline: none;
  border: none;
  border-radius: 20px;
  padding: 12px 10px;
}
.search-btn {
  padding: 10px;
  border-radius: 20px;
  outline: none;
  border: none;
  cursor: pointer;
}
</style>
