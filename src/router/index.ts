import { createRouter, createWebHistory } from 'vue-router';

// 기본페이지
import HomePage from '@/pages/HOL1_HomePage.vue';
// 예외페이지
import FailPage from '@/pages/etc/ETL1_404Page.vue';
import LoadingPage from '@/pages/etc/ETL1_LoadingPage.vue';
import NotFoundPage from '@/pages/etc/ETL1_404Page.vue';
// 라우트 모듈
import authRoutes from './auth';
import eventRoutes from './event';
import giftRoutes from './gift';
import nohooRoutes from './nohoo';
import profileRoutes from './profile';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },

    {
      path: '/fail',
      name: 'fail',
      component: FailPage,
    },
    {
      path: '/loading',
      name: 'loading',
      component: LoadingPage,
    },
    ...authRoutes,
    ...eventRoutes,
    ...giftRoutes,
    ...nohooRoutes,
    ...profileRoutes,
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundPage,
    },
  ],
});

export default router;
