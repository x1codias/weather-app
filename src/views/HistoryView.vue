<template>
  <div class="grid-container">
    <div class="search-history">
      <ul>
        <li v-for="search in searches" :key="search.date">{{ search.city }} - {{ search.date }}</li>
      </ul>
    </div>
    <div class="map"></div>
    <div class="forecast"></div>
  </div>
</template>

<script>
import { useHistoryStore } from '../stores/history'

export default {
  computed: {
    searches() {
      const historyStore = useHistoryStore()
      return historyStore.searches
    }
  }
}
</script>

<style>
.grid-container {
  padding-top: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 10px;
}
.search-history {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  background-color: lightblue;
}
.map-history {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
}
.forecast-history {
  grid-column: 1 / 3;
  grid-row: 2 / 3;
  background-color: lightgreen;
}
</style>
