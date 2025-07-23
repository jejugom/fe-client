import type { RouteRecordRaw } from 'vue-router';

const assetSetting: RouteRecordRaw[] = [
  {
    path: '/auth/start',
    name: 'auth-start',
    component: import('@/pages/assetSetting/ASL1_AssetStartPage.vue'),
  },
  {
    path: '/auth/kookmin-login',
    name: 'auth-kookmin-login',
    component: import('@/pages/assetSetting/ASL2_KookminLoginPage.vue'),
  },
  {
    path: '/auth/custom-start',
    name: 'auth-custom-start',
    component: import('@/pages/assetSetting/ASL3_CustomStartPage.vue'),
  },
  {
    path: '/auth/custom-quiz',
    name: 'auth-custom-quiz',
    component: import('@/pages/assetSetting/ASL4_CustomQuizPage.vue'),
  },
  {
    path: '/auth/signup-complete',
    name: 'auth-signup-complete',
    component: import('@/pages/assetSetting/ASL5_SignupCompletePage.vue'),
  },
];

export default assetSetting;
