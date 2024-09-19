import { defineStore } from 'pinia';
import { ref } from 'vue';

export type HistoryState = {
  city: string;
  date: string;
};

export const useHistoryStore = defineStore('history', () => {
  const searches = ref<HistoryState[]>([]);

  const addSearch = (search: { city: string; date: string }) => {
    searches.value.push(search);
  };

  const deleteSearch = () => {
    searches.value = [];
  };

  return { searches, addSearch, deleteSearch };
});
