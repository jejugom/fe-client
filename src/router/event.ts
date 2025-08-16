import type { RouteRecordRaw } from 'vue-router';

const eventRoutes: RouteRecordRaw[] = [
  {
    path: '/event',
    name: 'event',
    component: () => import('@/pages/event/EVL1_EventPage.vue'),
  },
  {
    path: '/event/quiz',
    name: 'event-quiz',
    component: () => import('@/pages/event/EVL2_QuizPage.vue'),
  },
  {
    path: '/event/number',
    name: 'event-number',
    component: () => import('@/pages/event/EVL2_NumberPage.vue'),
  },
  {
    path: '/event/park',
    name: 'event-park',
    component: () => import('@/pages/event/EVL2_ParkPage.vue'),
  },
];

export default eventRoutes;
