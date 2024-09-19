<script setup lang="ts">
import L from 'leaflet';
import { type Forecast } from '../services/weatherService';
import { useHistoryStore } from '../stores/history';
import FiveDayWeather from '@/utils/components/FiveDayWeather.vue';
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { fetchWeather } from '@/utils/functions/fetchWeather';

const city = ref('');
const forecast = ref<Forecast | null>(null);
const map = ref<L.Map | null>(null);
const marker = ref<L.Marker | null>(null);
const loading = ref(false);
const { addSearch } = useHistoryStore();

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

const getWeather = async (city: string) => {
  await fetchWeather(loading, city, locale.value, forecast, map, marker, addSearch);
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
        @keyup.enter="getWeather(city)"
        :disabled="loading"
      />
      <button class="search-btn" :disabled="loading" @click="getWeather(city)">
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
