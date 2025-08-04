import type { RouteRecordRaw } from 'vue-router';

const inheritanceRoutes: RouteRecordRaw[] = [
  {
    path: '/inheritance/start',
    name: 'inheritance-start',
    component: () =>
      import('@/pages/inheritance/IHT1_InheritanceStartPage.vue'),
  },
  {
    path: '/inheritance/input',
    name: 'inheritance-input',
    component: () => import('@/pages/gift/JEL3_GiftInputPage.vue'),
    props: { mode: 'inheritance' },
  },
  {
    path: '/inheritance/quiz',
    name: 'inheritance-quiz',
    component: () => import('@/pages/gift/JEL4_GiftQuizPage.vue'),
    props: { mode: 'inheritance' },
  },
  {
    path: '/inheritance/will',
    name: 'inheritance-will',
    component: () => import('@/pages/inheritance/IHT4_InheritanceWillPage.vue'),
  },
  {
    path: '/inheritance/result',
    name: 'inheritance-result',
    component: () =>
      import('@/pages/inheritance/IHT5_InheritanceResultPage.vue'),
  },
];

export default inheritanceRoutes;
