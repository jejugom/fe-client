import type { RouteRecordRaw } from 'vue-router';

const inheritanceRoutes: RouteRecordRaw[] = [
  {
    path: '/inheritance/start',
    name: 'inheritance-start',
    component: () =>
      import('@/pages/inheritance/IHL1_InheritanceStartPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/inheritance/input',
    name: 'inheritance-input',
    component: () => import('@/pages/gift/JEL3_GiftInputPage.vue'),
    props: { mode: 'inheritance' },
    meta: { requiresAuth: true },
  },
  {
    path: '/inheritance/quiz',
    name: 'inheritance-quiz',
    component: () => import('@/pages/gift/JEL4_GiftQuizPage.vue'),
    props: { mode: 'inheritance' },
    meta: { requiresAuth: true },
  },
  {
    path: '/inheritance/will',
    name: 'inheritance-will',
    component: () => import('@/pages/inheritance/IHL4_InheritanceWillPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/inheritance/result',
    name: 'inheritance-result',
    component: () =>
      import('@/pages/inheritance/IHL5_InheritanceResultPage.vue'),
    meta: { requiresAuth: true },
  },
];

export default inheritanceRoutes;
