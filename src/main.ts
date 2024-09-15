import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n'
import './assets/main.css'

const pinia = createPinia()
const i18n = createI18n({
  locale: 'en',
  messages: {
    en: {
      weather: 'Weather',
      history: 'History'
    },
    pt: {
      weather: 'Clima',
      history: 'Histórico'
    }
  }
})

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(i18n)
app.mount('#app')
