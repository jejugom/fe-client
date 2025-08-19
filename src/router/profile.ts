import type { RouteRecordRaw } from 'vue-router';

const profileRoutes: RouteRecordRaw[] = [
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/pages/profile/MYL1_ProfilePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/register',
    name: 'register-list',
    component: () => import('@/pages/profile/MYL2_RegisterListPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/asset/edit',
    name: 'edit-asset',
    component: () => import('@/pages/profile/MYL2_EditAssetPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/branch',
    name: 'edit-branch',
    component: () => import('@/pages/profile/MYL2_EditBranchPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/edit',
    name: 'edit-profile',
    component: () => import('@/pages/profile/MYL2_EditProfilePage.vue'),
    meta: { requiresAuth: true },
  },
];

export default profileRoutes;
