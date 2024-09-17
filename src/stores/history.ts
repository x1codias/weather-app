import { defineStore } from 'pinia';

export type HistoryState = {
  searches: {
    city: string;
    date: string;
  }[];
};

export const useHistoryStore = defineStore('history', {
  state: (): HistoryState => ({
    searches: []
  }),
  actions: {
    addSearch(search: { city: string; date: string }) {
      this.searches.push(search);
    }
  }
});
