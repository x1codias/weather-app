import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import { addIcons, OhVueIcon } from 'oh-vue-icons';
import * as FaIcons from 'oh-vue-icons/icons/fa';
import * as FlagIcons from 'oh-vue-icons/icons/fi';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import { i18n } from './translations/i18n';
import { VueSpinnerDots } from 'vue3-spinners';

const icons = Object.values({ ...FaIcons, ...FlagIcons });

addIcons(...icons);

const pinia = createPinia();

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(i18n);
app.component('PerfectScrollbar', PerfectScrollbar); // Register globally
app.component('VueSpinnerDots', VueSpinnerDots); // Register globally
app.component('v-icon', OhVueIcon);
app.mount('#app');
