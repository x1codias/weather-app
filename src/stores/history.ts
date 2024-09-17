import { defineStore } from 'pinia';

export const useHistoryStore = defineStore('history', {
  state: () => ({
    searches: []
  }),
  actions: {
    addSearch(search: { city: string; date: string }) {
      this.searches.push(search);
    }
  }
});
