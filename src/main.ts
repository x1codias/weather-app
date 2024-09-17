import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { createI18n } from 'vue-i18n';
import './assets/main.css';
import { addIcons, OhVueIcon } from 'oh-vue-icons';
import * as FaIcons from 'oh-vue-icons/icons/fa';

const Fa = Object.values({ ...FaIcons });

addIcons(...Fa);

const pinia = createPinia();
const i18n = createI18n({
  locale: 'en',
  messages: {
    en: {
      weather: 'Weather',
      history: 'History',
      searchCity: 'Search city'
    },
    pt: {
      weather: 'Clima',
      history: 'Histórico',
      searchCity: 'Pesquisar cidade'
    }
  }
});

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(i18n);
app.component('v-icon', OhVueIcon);
app.mount('#app');
