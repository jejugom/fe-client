import type { RouteRecordRaw } from 'vue-router';
import LoginPage from '@/pages/auth/LoginPage.vue';
import RegisterPage from '@/pages/auth/RegisterPage.vue';

const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth/login',
    name: 'auth-login',
    component: LoginPage,
  },
  {
    path: '/auth/register',
    name: 'auth-register',
    component: RegisterPage,
  },
];

export default authRoutes;
