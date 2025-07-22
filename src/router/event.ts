import type { RouteRecordRaw } from 'vue-router';
import EventPage from '@/pages/event/EVL1_EventPage.vue';

const eventRoutes: RouteRecordRaw[] = [
  {
    path: '/event',
    name: 'event-page',
    component: EventPage,
  },
];

export default eventRoutes;
