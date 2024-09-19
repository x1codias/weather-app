import type { Map, Marker } from 'leaflet';
import L from 'leaflet';
import { nextTick, onBeforeUnmount, onMounted } from 'vue';

export const useMap = (map: { value: Map | null }, marker: { value: Marker | null }) => {
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
};
