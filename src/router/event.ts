import type { RouteRecordRaw } from 'vue-router';

const eventRoutes: RouteRecordRaw[] = [
  {
    path: '/event',
    name: 'event',
    component: () => import('@/pages/event/EVL1_EventPage.vue'),
  },
];

export default eventRoutes;
