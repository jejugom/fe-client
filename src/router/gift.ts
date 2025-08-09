import type { RouteRecordRaw } from 'vue-router';

const giftRoutes: RouteRecordRaw[] = [
  {
    path: '/gift',
    name: 'gift',
    component: () => import('@/pages/gift/JEL1_GiftPage.vue'),
  },
  {
    path: '/gift/start',
    name: 'gift-start',
    component: () => import('@/pages/gift/JEL2_GiftStartPage.vue'),
  },
  {
    path: '/gift/input',
    name: 'gift-input',
    component: () => import('@/pages/gift/JEL3_GiftInputPage.vue'),
    props: { mode: 'gift' }, // props로 모드 전달
  },
  {
    path: '/gift/quiz',
    name: 'gift-quiz',
    component: () => import('@/pages/gift/JEL4_GiftQuizPage.vue'),
    props: { mode: 'gift' }, // props로 모드 전달
  },
  {
    path: '/gift/faq',
    name: 'gift-faq',
    component: () => import('@/pages/gift/JEL2_FaqPage.vue'),
  },
  {
    path: '/gift/faq/:id', // 동적 라우팅 - :id가 파라미터
    name: 'gift-detail',
    component: () => import('@/pages/gift/JEL3_FaqDetailPage.vue'),
    props: true, // 라우트 파라미터를 컴포넌트 props로 전달
  },
  {
    path: '/gift/result',
    name: 'gift-result',
    component: () => import('@/pages/gift/JEL5_GiftResultPage.vue'),
  },
  {
    path: '/gift/tax-info',
    name: 'GiftTaxInfo',
    component: () => import('@/pages/gift/GiftTaxInfoPage.vue'),
  },
  // {
  //   path: '/gift/register',
  //   name: 'gift-register',
  //   component: () => import('@/pages/gift/JEL6_RegisterPage.vue'),
  // },
  // {
  //   path: '/gift/register/complete',
  //   name: 'gift-register-complete',
  //   component: () => import('@/pages/gift/JEL7_RegisterCompletePage.vue'),
  // },
];

export default giftRoutes;
