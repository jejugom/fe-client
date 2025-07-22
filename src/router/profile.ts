import type { RouteRecordRaw } from 'vue-router';

const profileRoutes: RouteRecordRaw[] = [
  {
    path: '/profile',
    name: 'profile',
    component: import('@/pages/profile/MYL1_ProfilePage.vue'),
  },
  {
    path: '/asset/edit',
    name: 'edit-asset',
    component: import('@/pages/profile/MYL2_EditAssetPage.vue'),
  },
  {
    path: '/profile/branch',
    name: 'edit-branch',
    component: import('@/pages/profile/MYL2_EditBranchPage.vue'),
  },
];

export default profileRoutes;
