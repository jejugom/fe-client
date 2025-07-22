import type { RouteRecordRaw } from 'vue-router';
import AssetStartPage from '@/pages/assetSetting/ASL1_AssetStartPage.vue';
import KookminLoginPage from '@/pages/assetSetting/ASL2_KookminLoginPage.vue';
import CustomStartPage from '@/pages/assetSetting/ASL3_CustomStartPage.vue';
import CustomQuizPage from '@/pages/assetSetting/ASL4_CustomQuizPage.vue';
import SignupCompletePage from '@/pages/assetSetting/ASL5_SignupCompletePage.vue';

const assetSetting: RouteRecordRaw[] = [
  {
    path: '/auth/start',
    name: 'auth-start',
    component: AssetStartPage,
  },
  {
    path: '/auth/kookmin-login',
    name: 'auth-kookmin-login',
    component: KookminLoginPage,
  },
  {
    path: '/auth/custom-start',
    name: 'auth-custom-start',
    component: CustomStartPage,
  },
  {
    path: '/auth/custom-quiz',
    name: 'auth-custom-quiz',
    component: CustomQuizPage,
  },
  {
    path: '/auth/signup-complete',
    name: 'auth-signup-complete',
    component: SignupCompletePage,
  },
];

export default assetSetting;
