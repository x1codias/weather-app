<template>
  <div class="grid-container-home">
    <div class="search">
      <input
        class="search-input"
        v-model="city"
        placeholder="Enter city"
        @keyup.enter="fetchWeather"
      />
    </div>
    <div class="current-weather"></div>
    <div id="map"></div>
    <div class="forecast"></div>
    <div class="forecast" v-if="weatherData">
      <h2>{{ weatherData.city.name }}</h2>
      <ul>
        <li v-for="forecast in weatherData.list.slice(0, 5)" :key="forecast.dt">
          <img :src="getWeatherIcon(forecast.weather[0].icon)" alt="Weather Icon" />
          <p>{{ forecast.dt_txt }} - {{ forecast.main.temp }}°C</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import L from 'leaflet'
import { getWeatherByCity } from '../services/weatherService'
import { useHistoryStore } from '../stores/history'

export default {
  data() {
    return {
      city: '',
      weatherData: null,
      map: null as L.Map | null,
      marker: null as L.Marker | null
    }
  },
  mounted() {
    this.initializeMap()
    window.addEventListener('resize', this.onResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    initializeMap() {
      // Initialize the map with default coordinates
      this.map = L.map('map').setView([51.505, -0.09], 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map)

      this.marker = L.marker([51.505, -0.09]).addTo(this.map)
      this.marker.bindPopup('Default Location').openPopup()

      // Invalidate size to make sure map is rendered correctly
      this.$nextTick(() => {
        this.map?.invalidateSize()
      })
    },
    async fetchWeather() {
      try {
        const data = await getWeatherByCity(this.city)
        this.weatherData = data

        // Extract coordinates from the weather data
        const { lat, lon } = data.city.coord

        // Update the map's view to the city's coordinates
        if (this.map) {
          this.map.setView([lat, lon], 13)

          // Update the marker position
          if (this.marker) {
            this.marker.setLatLng([lat, lon]).bindPopup(`Weather in ${this.city}`).openPopup()
          }
        }

        // Save search to history
        const historyStore = useHistoryStore()
        historyStore.addSearch({ city: this.city, date: new Date().toLocaleString() })
      } catch (error) {
        console.error('Error fetching weather:', error)
      }
    },
    getWeatherIcon(icon: string) {
      return `http://openweathermap.org/img/wn/${icon}@2x.png`
    },
    onResize() {
      // Invalidate the map size on window resize
      this.map?.invalidateSize()
    }
  }
}
</script>

<style>
.grid-container-home {
  padding-top: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 2fr;
  gap: 10px;
  align-content: center;
  justify-content: center;
}
.search {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}
#map {
  grid-column: 2 / 3;
  grid-row: 1 / 3;
  min-height: 600px;
  border-radius: 20px;
}
.current-weather {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
}
.forecast {
  grid-column: 1 / 3;
  grid-row: 3 / 4;
}
.search-input {
  width: 100%;
  height: fit-content;
  outline: none;
  border: none;
  border-radius: 20px;
}
</style>
