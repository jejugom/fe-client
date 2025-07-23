import './assets/main.css';
import 'vue-awesome-paginate/dist/style.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VueAwesomePaginate from 'vue-awesome-paginate';

import App from './App.vue';
import router from './router';
import VueApexCharts from 'vue3-apexcharts';

const app = createApp(App);

app.use(VueAwesomePaginate);
app.use(createPinia());
app.use(router);
app.component('apexchart', VueApexCharts);

app.mount('#app');
