import { defineStore } from 'pinia'

export const useHistoryStore = defineStore('history', {
  state: () => ({
    searches: []
  }),
  actions: {
    addSearch(search: string) {
      this.searches.push(search)
    }
  }
})
