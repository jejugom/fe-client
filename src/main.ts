import './main.css';
import 'vue-awesome-paginate/dist/style.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import VueAwesomePaginate from 'vue-awesome-paginate';
import VueApexCharts from 'vue3-apexcharts';
import VCalendar from 'v-calendar';

import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);
app.use(VueAwesomePaginate);
app.use(VCalendar, {});
app.component('apexchart', VueApexCharts);

app.mount('#app');
