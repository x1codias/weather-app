<script setup lang="ts">
import { type Forecast } from '@/services/weatherService';
import { useHistoryStore, type HistoryState } from '../stores/history';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import FiveDayWeather from '@/utils/components/FiveDayWeather.vue';
import { fetchWeather } from '@/utils/functions/fetchWeather';
import { useMap } from '@/utils/composables/useMap';
import type { Map, Marker } from 'leaflet';

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
        v-for="search in searchResults"
        :key="search.date"
        @click="getWeather(search.city)"
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
    <button v-if="searchResults.length" @click="resetSearch" class="delete-history-btn">
      <h3 style="font-weight: 600">{{ t('resetHistory') }}</h3>
    </button>
  </div>
  <div id="map"></div>
  <div class="forecast" v-if="!forecast && !loading">
    <h2 style="align-self: center; margin: 0 auto">
      {{ t('searchFirst') }}
    </h2>
  </div>
  <FiveDayWeather v-if="forecast && !loading" :forecast="forecast" :loading="loading" />
  <VueSpinnerDots v-if="!forecast && loading" :size="100" />
</template>

<style>
@import 'vue3-perfect-scrollbar/style.css';

.ps {
  display: flex;
  padding: 10px 0;
}
.search-history {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
  border: 2px solid gray;
  border-radius: 30px;
  display: flex;
  overflow: auto;
  justify-content: space-between;
}

.search-history-results {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  overflow: auto;
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
#map {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
  border-radius: 20px;
  min-height: 700px;
}
</style>
