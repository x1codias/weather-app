<script setup lang="ts">
import { Map, Marker } from 'leaflet';
import { type Forecast } from '../../services/weatherService';
import { useHistoryStore } from '../../stores/history';
import FiveDayWeather from '@/utils/components/FiveDayWeather.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { fetchWeather } from '@/utils/functions/fetchWeather';
import { useMap } from '@/utils/composables/useMap';
import './styles.css';

const city = ref('');
const forecast = ref<Forecast | null>(null);
const loading = ref(false);
const { addSearch } = useHistoryStore();

const { locale, t } = useI18n();

const { map, marker } = useMap();

const getWeather = async (city: string) => {
  await fetchWeather(
    loading,
    city,
    locale.value,
    forecast,
    map.value as Map | null,
    marker.value as Marker | null,
    addSearch
  );
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
      id="search-input"
    />
    <button id="search-btn" class="search-btn" :disabled="loading" @click="getWeather(city)">
      <v-icon name="fa-search" fill="gray" />
    </button>
  </div>
  <div id="map"></div>
  <div id="no-forecast-data" class="forecast" v-if="!forecast && !loading">
    <h2 style="align-self: center; margin: 0 auto">
      {{ t('searchFirst') }}
    </h2>
  </div>
  <FiveDayWeather v-if="forecast && !loading" :forecast="forecast" :loading="loading" />
  <VueSpinnerDots v-if="!forecast && loading" />
</template>
