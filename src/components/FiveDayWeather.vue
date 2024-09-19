<script setup lang="ts">
import moment from 'moment';
import type { Forecast } from '@/services/weatherService';
import { useI18n } from 'vue-i18n';

defineProps<{
  forecast: Forecast | null;
  loading: boolean;
}>();

const { locale } = useI18n();

const getWeatherIcon = (icon: string) => {
  return `http://openweathermap.org/img/wn/${icon}@2x.png`;
};

const formatDate = (date: string) => {
  return moment(date).locale(locale.value).format('MMMM, DD');
};
</script>

<template>
  <div class="forecast forecast-grid" v-if="forecast">
    <div class="weather-card" v-for="forecast in forecast.data.list" :key="forecast.dt">
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
</template>

<style>
.weather-card {
  background-color: #ccc;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
.forecast {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  max-height: 800px;
  overflow: auto;
  border-radius: 20px;
  border: 2px solid lightslategray;
  display: flex;
}
.forecast-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(200px, 400px)); /* Dynamic columns */
  grid-gap: 20px; /* Spacing between items */
  padding: 20px;
}
</style>
