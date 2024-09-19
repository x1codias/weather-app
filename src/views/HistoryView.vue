<script setup lang="ts">
import L from 'leaflet';
import { getFiveDayForecast, type Forecast } from '@/services/weatherService';
import { useHistoryStore } from '../stores/history';
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import FiveDayWeather from '@/components/FiveDayWeather.vue';

const forecast = ref<Forecast | null>(null);
const map = ref<L.Map | null>(null);
const marker = ref<L.Marker | null>(null);
const loading = ref<boolean>(false);

const historyStore = useHistoryStore();

const { locale, t } = useI18n();

const searches = () => {
  return historyStore.searches;
};

const deleteSearches = () => {
  historyStore.deleteSearch();
};

const initializeMap = () => {
  // Initialize the map with default coordinates
  map.value = L.map('map-history').setView([51.505, -0.09], 12);

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

const fetchWeather = async (city: string) => {
  loading.value = true;
  try {
    const forecastData = await getFiveDayForecast(city, locale.value);
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
  <div class="grid-container">
    <div class="search-history">
      <h4 style="padding: 10px" v-if="!searches.length">
        {{ t('searchHistoryEmpty') }}
      </h4>
      <div
        style="padding: 10px"
        v-for="search in searches"
        :key="search.date"
        @click="fetchWeather(search.city)"
      >
        <p style="background-color: gray; padding: 2px 10px; border-radius: 20px; cursor: pointer">
          {{ search.city }} - {{ search.date }}
        </p>
      </div>
      <button v-if="searches.length" @click="deleteSearches" class="delete-history-btn">
        <h4>{{ t('resetHistory') }}</h4>
      </button>
    </div>
    <div id="map-history"></div>
    <div class="forecast" v-if="!forecast">
      <h2 style="align-self: center; margin: 0 auto">
        {{ t('searchFirst') }}
      </h2>
    </div>
    <FiveDayWeather :forecast="forecast" :loading="loading" />
  </div>
</template>

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
.delete-history-btn {
  width: fit-content;
  cursor: pointer;
  border: none;
  outline: unset;
  background-color: transparent;
  border-left: 2px solid gray;
  padding: 0 16px;
  color: gray;
  transition: all 0.2s ease;
  &:hover {
    color: black;
    background-color: gray;
  }
}
</style>
