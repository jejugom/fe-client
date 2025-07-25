import type { RouteRecordRaw } from 'vue-router';

const authRoutes: RouteRecordRaw[] = [
  {
    path: '/tutorial',
    name: 'tutorial',
    component: () => import('@/pages/auth/TutorialPage.vue'),
  },
];

export default authRoutes;
