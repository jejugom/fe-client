import type { RouteRecordRaw } from 'vue-router';
import ProfilePage from '@/pages/profile/MYL1_ProfilePage.vue';
import EditAssetPage from '@/pages/profile/MYL2_EditAssetPage.vue';
import EditBranchPage from '@/pages/profile/MYL2_EditBranchPage.vue';

const profileRoutes: RouteRecordRaw[] = [
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage,
  },
  {
    path: '/asset/edit',
    name: 'edit-asset',
    component: EditAssetPage,
  },
  {
    path: '/profile/branch',
    name: 'edit-branch',
    component: EditBranchPage,
  },
];

export default profileRoutes;
