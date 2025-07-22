import type { RouteRecordRaw } from 'vue-router';
import GiftPage from '@/pages/gift/JEL1_GiftPage.vue';
import FaqPage from '@/pages/gift/JEL2_FaqPage.vue';
import GiftStartPage from '@/pages/gift/JEL2_GiftStartPage.vue';
import FaqDetailPage from '@/pages/gift/JEL3_FaqDetailPage.vue';
import GiftInputPage from '@/pages/gift/JEL3_GiftInputPage.vue';
import GiftQuizPage from '@/pages/gift/JEL4_GiftQuizPage.vue';
import GiftResultPage from '@/pages/gift/JEL5_GiftResultPage.vue';
import RegisterPage from '@/pages/gift/JEL6_RegisterPage.vue';
import RegisterCompletePage from '@/pages/gift/JEL7_RegisterCompletePage.vue';

const giftRoutes: RouteRecordRaw[] = [
  {
    path: '/gift',
    name: 'gift-page',
    component: GiftPage,
  },
  {
    path: '/gift/start',
    name: 'gift-start',
    component: GiftStartPage,
  },
  {
    path: '/gift/input',
    name: 'gift-input',
    component: GiftInputPage,
  },
  {
    path: '/gift/quiz',
    name: 'gift-quiz',
    component: GiftQuizPage,
  },
  {
    path: '/gift/faq',
    name: 'gift-faq',
    component: FaqPage,
  },
  {
    path: '/gift/faq/:id', // 동적 라우팅 - :id가 파라미터
    name: 'gift-detail',
    component: FaqDetailPage,
    props: true, // 라우트 파라미터를 컴포넌트 props로 전달
  },
  {
    path: '/gift/result',
    name: 'gift-result',
    component: GiftResultPage,
  },
  {
    path: '/gift/register',
    name: 'gift-register',
    component: RegisterPage,
  },
  {
    path: '/gift/register/complete',
    name: 'gift-register-complete',
    component: RegisterCompletePage,
  },
];

export default giftRoutes;
