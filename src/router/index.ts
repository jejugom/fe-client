import { createRouter, createWebHistory } from 'vue-router';
import { isAuthenticated } from '@/utils/guard';

// 기본페이지
import HomePage from '@/pages/HOL1_HomePage.vue';
// 예외페이지
import FailPage from '@/pages/etc/ETL1_FailPage.vue';
import LoadingPage from '@/pages/etc/ETL1_LoadingPage.vue';
import NotFoundPage from '@/pages/etc/ETL1_404Page.vue';
// 라우트 모듈
import authRoutes from './auth';
import eventRoutes from './event';
import giftRoutes from './gift';
import nohooRoutes from './nohoo';
import profileRoutes from './profile';
import assetSetting from './assetSetting';
import productRoutes from './product';
import inheritanceRoutes from './inheritance';

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
    ...assetSetting,
    ...authRoutes,
    ...eventRoutes,
    ...giftRoutes,
    ...nohooRoutes,
    ...productRoutes,
    ...profileRoutes,
    ...inheritanceRoutes,
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundPage,
    },
  ],
  // 페이지 이동시 항상 최상단으로 이동
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      };
    }
    return { top: 0, behavior: 'smooth' };
  },
});

router.beforeEach((to) => {
  const allowedRoutes = [
    'home',
    'fail',
    'loading',
    'not-found',
    'auth-success',
    'auth-error',
  ];
  if (!allowedRoutes.includes(to.name as string)) {
    const authResult = isAuthenticated(to);
    if (authResult === false) {
      return false; // 리다이렉트
    } else if (authResult) {
      return authResult; // 리다이렉트
    }
  }
});

export default router;
