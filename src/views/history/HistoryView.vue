<script setup lang="ts">
import { type Forecast } from '@/services/weatherService';
import { useHistoryStore, type HistoryState } from '../../stores/history';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import FiveDayWeather from '@/utils/components/FiveDayWeather.vue';
import { fetchWeather } from '@/utils/functions/fetchWeather';
import { useMap } from '@/utils/composables/useMap';
import type { Map, Marker } from 'leaflet';
import './styles.css';

const forecast = ref<Forecast | null>(null);
const loading = ref<boolean>(false);
const { searches, deleteSearch } = useHistoryStore();
const searchResults = ref<HistoryState[]>(searches);

const { locale, t } = useI18n();

const { map, marker } = useMap();

const resetSearch = (e: MouseEvent) => {
  e.preventDefault();
  deleteSearch();
  searchResults.value = [];
};

const getWeather = async (city: string) => {
  await fetchWeather(
    loading,
    city,
    locale.value,
    forecast,
    map.value as Map | null,
    marker.value as Marker | null
  );
};
</script>

<template>
  <div class="search-history">
    <h4 style="padding: 10px" v-if="!searchResults.length">
      {{ t('searchHistoryEmpty') }}
    </h4>
    <PerfectScrollbar
      v-if="searchResults.length"
      :options="{
        useBothWheelAxes: true,
        wheelPropagation: true,
        suppressScrollY: true,
        swipeEasing: true,
        maxScrollbarLength: 1000
      }"
    >
      <div
        style="padding: 10px"
        v-for="(search, index) in searchResults"
        :key="search.date"
        @click="getWeather(search.city)"
        :id="`search-${index}`"
      >
        <p
          style="
            background-color: gray;
            padding: 2px 10px;
            border-radius: 20px;
            cursor: pointer;
            white-space: nowrap;
          "
        >
          {{ search.city }} - {{ search.date }}
        </p>
      </div>
    </PerfectScrollbar>
    <button
      id="reset-history-btn"
      v-if="searchResults.length"
      @click="resetSearch"
      class="delete-history-btn"
    >
      <h3 style="font-weight: 600">{{ t('resetHistory') }}</h3>
    </button>
  </div>
  <div id="map"></div>
  <div id="no-forecast-data" class="forecast" v-if="!forecast && !loading">
    <h2 style="align-self: center; margin: 0 auto">
      {{ t('searchFirst') }}
    </h2>
  </div>
  <FiveDayWeather v-if="forecast && !loading" :forecast="forecast" :loading="loading" />
  <VueSpinnerDots v-if="!forecast && loading" :size="100" />
</template>
