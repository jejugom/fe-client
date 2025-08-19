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
  // 인증이 필요한 페이지인지 확인
  const requiresAuth = to.meta.requiresAuth;

  // 인증이 필요한 페이지일 경우에 isAuthenticated 함수를 호출
  if (requiresAuth) {
    const authResult = isAuthenticated(to);
    // isAuthenticated 함수가 false를 반환하면 리다이렉트를 처리
    if (!authResult) {
      return false;
    }
    // 리다이렉트 객체를 반환
    if (authResult !== true) {
      return authResult;
    }
  }
  // 그 외 모든 경우(인증이 필요 없거나, 인증이 성공했거나)는 정상적으로 다음 단계로 진행
  return true;
});

export default router;
