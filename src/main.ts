import './main.css';
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
  return new Promise<void>((resolve) => {
    if (!kakaoAppKey) {
      console.warn(
        '카카오 지도 API 키가 설정되지 않았습니다.\n' +
          '해결방법: 프로젝트 루트에 .env 파일을 생성하고 다음을 추가하세요:\n' +
          'VITE_KAKAO_MAP_KEY=your_kakao_api_key'
      );
      resolve();
      return;
    }

    // 이미 로드된 경우
    if ((window as any).kakao && (window as any).kakao.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${kakaoAppKey}&libraries=services`;

    script.onload = () => {
      if ((window as any).kakao && (window as any).kakao.maps) {
        (window as any).kakao.maps.load(() => {
          console.log('카카오 지도 API 로드 완료');
          resolve();
        });
      } else {
        console.error(
          '❌ 카카오 지도 초기화 실패: kakao 객체를 찾을 수 없습니다.\n' +
            '가능한 원인:\n' +
            '1. JavaScript API 키로 넣은게 아닐 수 있음\n' +
            '2. 네트워크 연결 문제'
        );
        resolve();
      }
    };

    script.onerror = () => {
      console.error(
        '❌ 카카오 지도 스크립트 로드 실패\n' +
          '확인해볼 사항:\n' +
          '1. API 키 유효성: ' +
          (kakaoAppKey ? '설정됨' : '미설정') +
          '\n' +
          '2. 네트워크 연결 상태\n' +
          '3. 카카오 개발자 콘솔 설정에서 설정 확인'
      );
      resolve();
    };

    document.head.appendChild(script);
  });
}

async function bootstrap() {
  try {
    await loadKakaoMapApi(); // Kakao Maps API 로딩 시도
  } catch (error) {
    console.error('카카오 지도 API 초기화 실패:', error);
  }

  app.use(VueAwesomePaginate);
  app.use(createPinia());
  app.use(VCalendar, {});
  app.use(router);
  app.component('apexchart', VueApexCharts);
  app.mount('#app');
}

bootstrap();
