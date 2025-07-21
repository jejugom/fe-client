import type { RouteRecordRaw } from 'vue-router';
import JeungyeoPage from '@/pages/jeungyeo/JeungyeoPage.vue';
import JeungyeoInputPage from '@/pages/jeungyeo/JeungyeoInputPage.vue';
import JeungyeoQuizPage from '@/pages/jeungyeo/JeungyeoQuizPage.vue';
import JeungyeoStartPage from '@/pages/jeungyeo/JeungyeoStartPage.vue';
import JeungyeoFaqPage from '@/pages/jeungyeo/JeungyeoFaqPage.vue';
import JeungyeoFaqDetail from '@/pages/jeungyeo/JeungyeoFaqDetail.vue';
import JeungyeoResultPage from '@/pages/jeungyeo/JeungyeoResultPage.vue';

const jeungyeoRoutes: RouteRecordRaw[] = [
  {
    path: '/jeungyeo',
    name: 'jeungyeo-page',
    component: JeungyeoPage,
  },
  {
    path: '/jeungyeo/start',
    name: 'jeungyeo-start',
    component: JeungyeoStartPage,
  },
  {
    path: '/jeungyeo/input',
    name: 'jeungyeo-input',
    component: JeungyeoInputPage,
  },
  {
    path: '/jeungyeo/quiz',
    name: 'jeungyeo-quiz',
    component: JeungyeoQuizPage,
  },
  {
    path: '/jeungyeo/faq',
    name: 'jeungyeo-faq',
    component: JeungyeoFaqPage,
  },
  {
    path: '/jeungyeo/faq/:id', // 동적 라우팅 - :id가 파라미터
    name: 'jeungyeo-detail',
    component: JeungyeoFaqDetail,
    props: true, // 라우트 파라미터를 컴포넌트 props로 전달
  },
  {
    path: '/jeungyeo/result',
    name: 'jeungyeo-result',
    component: JeungyeoResultPage,
  },
];

export default jeungyeoRoutes;
