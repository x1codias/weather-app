<script setup lang="ts">
import L from 'leaflet';
import { getFiveDayForecast, type Forecast } from '../services/weatherService';
import { useHistoryStore } from '../stores/history';
import FiveDayWeather from '@/components/FiveDayWeather.vue';
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const city = ref('');
const forecast = ref<Forecast | null>(null);
const map = ref<L.Map | null>(null);
const marker = ref<L.Marker | null>(null);
const loading = ref(false);

const { locale, t } = useI18n();

const initializeMap = () => {
  // Initialize the map with default coordinates
  map.value = L.map('map').setView([51.505, -0.09], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map.value);

  marker.value = L.marker([51.505, -0.09]).addTo(map.value);

  // Invalidate size to make sure map is rendered correctly
  nextTick(() => {
    map.value?.invalidateSize();
  });
};

const fetchWeather = async () => {
  loading.value = true;
  try {
    const forecastData = await getFiveDayForecast(city.value, locale.value);
    forecast.value = forecastData;

    // Extract coordinates from the weather data
    const { lat, lon } = forecastData.data.city.coord;

    // Update the map's view to the city's coordinates
    if (map.value) {
      map.value?.setView([lat, lon], 14);

      // Update the marker position
      if (marker.value) {
        marker.value?.setLatLng([lat, lon]);
      }
    }

    // Save search to history
    const historyStore = useHistoryStore();
    historyStore.addSearch({ city: city.value, date: new Date().toLocaleString() });
    loading.value = false;
  } catch (error) {
    loading.value = false;
    console.error('Error fetching weather:', error);
  }
};

const onResize = () => {
  // Invalidate the map size on window resize
  map.value?.invalidateSize();
};

onMounted(() => {
  initializeMap();
  window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
});
</script>

<template>
  <div class="grid-container-home">
    <div class="search">
      <input
        class="search-input"
        v-model="city"
        :placeholder="t('searchCity')"
        @keyup.enter="fetchWeather"
        :disabled="loading"
      />
      <button class="search-btn" :disabled="loading" @click="fetchWeather">
        <v-icon name="fa-search" fill="gray" />
      </button>
    </div>
    <div id="map"></div>
    <div class="forecast" v-if="!forecast">
      <h2 style="align-self: center; margin: 0 auto">
        {{ t('searchFirst') }}
      </h2>
    </div>
    <FiveDayWeather :forecast="forecast" :loading="loading" />
  </div>
</template>

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
  border-radius: 30px;
  outline: none;
  border: none;
  cursor: pointer;
  background-color: transparent;
  border: 2px solid gray;
  transition: all 0.2s ease;
  &:hover {
    background-color: gray;
  }
  &:hover > svg {
    fill: black;
  }
}
</style>
