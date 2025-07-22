import type { RouteRecordRaw } from 'vue-router';
import AssetStartPage from '@/pages/auth/ASL1_AssetStartPage.vue';
import KookminLoginPage from '@/pages/auth/ASL2_KookminLoginPage.vue';
import CustomStartPage from '@/pages/auth/ASL3_CustomStartPage.vue';
import CustomQuizPage from '@/pages/auth/ASL4_CustomQuizPage.vue';
import SignupCompletePage from '@/pages/auth/ASL5_SignupCompletePage.vue';

const authRoutes: RouteRecordRaw[] = [
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

export default authRoutes;
