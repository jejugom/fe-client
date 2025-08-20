import type { RouteRecordRaw } from 'vue-router';

const nohooRoutes: RouteRecordRaw[] = [
  {
    path: '/nohoo',
    name: 'nohoo',
    component: () => import('@/pages/nohoo/NOL1_NohooPage.vue'),
    meta: { requiresAuth: true },
  },
];

export default nohooRoutes;
