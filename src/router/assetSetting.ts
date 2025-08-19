import type { RouteRecordRaw } from 'vue-router';

const assetSetting: RouteRecordRaw[] = [
  {
    path: '/asset/tutorial',
    name: 'asset-tutorial',
    component: () => import('@/pages/assetSetting/ASL0_TutorialPage.vue'),
  },
  {
    path: '/asset/start',
    name: 'asset-start',
    component: () => import('@/pages/assetSetting/ASL1_AssetStartPage.vue'),
    // 쿼리 파라미터 허용
    props: (route) => ({ from: route.query.from }),
    meta: { requiresAuth: true },
  },
  {
    path: '/asset/kookmin-login',
    name: 'asset-kookmin-login',
    component: () => import('@/pages/assetSetting/ASL2_KookminLoginPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/asset/custom-start',
    name: 'asset-custom-start',
    component: () => import('@/pages/assetSetting/ASL3_CustomStartPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/asset/custom-quiz',
    name: 'asset-custom-quiz',
    component: () => import('@/pages/assetSetting/ASL4_CustomQuizPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/asset/signup-complete',
    name: 'asset-signup-complete',
    component: () => import('@/pages/assetSetting/ASL5_SignupCompletePage.vue'),
    meta: { requiresAuth: true },
  },
];

export default assetSetting;
