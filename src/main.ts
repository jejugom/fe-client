import './assets/main.css';
import 'vue-awesome-paginate/dist/style.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VueAwesomePaginate from 'vue-awesome-paginate';

import App from './App.vue';
import router from './router';
import VueApexCharts from 'vue3-apexcharts';
import VCalendar from 'v-calendar';

const app = createApp(App);

// Kakao 지도 API 로드 함수 정의
const kakaoAppKey = import.meta.env.VITE_KAKAO_MAP_KEY;
function loadKakaoMapApi() {
  return new Promise<void>((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${kakaoAppKey}&libraries=services`;
    script.onload = () => {
      window.kakao.maps.load(() => {
        resolve();
      });
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function bootstrap() {
  await loadKakaoMapApi(); // Kakao Maps API 먼저 로딩
  app.use(VueAwesomePaginate);
  app.use(createPinia());
  app.use(VCalendar, {});
  app.use(router);
  app.component('apexchart', VueApexCharts);
  app.mount('#app');
}

bootstrap();
