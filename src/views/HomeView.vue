<script setup lang="ts">
import L from 'leaflet';
import { type Forecast } from '../services/weatherService';
import { useHistoryStore } from '../stores/history';
import FiveDayWeather from '@/utils/components/FiveDayWeather.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { fetchWeather } from '@/utils/functions/fetchWeather';
import { useMap } from '@/utils/composables/useMap';
import { OhVueIcon } from 'oh-vue-icons';

const city = ref('');
const forecast = ref<Forecast | null>(null);
const map = ref<L.Map | null>(null);
const marker = ref<L.Marker | null>(null);
const loading = ref(false);
const { addSearch } = useHistoryStore();

const { locale, t } = useI18n();

useMap(map, marker);

const getWeather = async (city: string) => {
  await fetchWeather(loading, city, locale.value, forecast, map, marker, addSearch);
};
</script>

<template>
  <div class="search">
    <input
      class="search-input"
      v-model="city"
      :placeholder="t('searchCity')"
      @keyup.enter="getWeather(city)"
      :disabled="loading"
    />
    <button class="search-btn" :disabled="loading" @click="getWeather(city)">
      <oh-vue-icon name="fa-search" fill="gray" />
    </button>
  </div>
  <div id="map"></div>
  <div class="forecast" v-if="!forecast">
    <h2 style="align-self: center; margin: 0 auto">
      {{ t('searchFirst') }}
    </h2>
  </div>
  <FiveDayWeather :forecast="forecast" :loading="loading" />
</template>

<style>
.search {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  height: fit-content;
  display: flex;
  align-items: center;
  gap: 12px;
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
