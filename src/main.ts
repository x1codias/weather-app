import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { createI18n } from 'vue-i18n';
import './assets/main.css';
import { addIcons, OhVueIcon } from 'oh-vue-icons';
import * as FaIcons from 'oh-vue-icons/icons/fa';
import * as FlagIcons from 'oh-vue-icons/icons/fi';
import en from './translations/en.json';
import pt from './translations/pt.json';
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';

const icons = Object.values({ ...FaIcons, ...FlagIcons });

addIcons(...icons);

const pinia = createPinia();
const i18n = createI18n({
  locale: 'en',
  messages: {
    en,
    pt
  }
});

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(i18n);
app.use(PerfectScrollbarPlugin);
app.component('v-icon', OhVueIcon);
app.mount('#app');
