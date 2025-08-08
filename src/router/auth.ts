import type { RouteRecordRaw } from 'vue-router';

const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth/success',
    name: 'auth-success',
    component: () => import('@/pages/auth/AuthSuccessPage.vue'),
  },
  {
    path: '/auth/error',
    name: 'auth-error',
    component: () => import('@/pages/auth/AuthErrorPage.vue'),
  },
];

export default authRoutes;
