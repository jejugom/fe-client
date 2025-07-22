import type { RouteRecordRaw } from 'vue-router';
import ProfilePage from '@/pages/profile/ProfilePage.vue';
import EditAssetPage from '@/pages/profile/EditAssetPage.vue';
import EditBranchPage from '@/pages/profile/EditBranchPage.vue';
import SyncAssetPage from '@/pages/profile/SyncAssetPage.vue';

const profileRoutes: RouteRecordRaw[] = [
  {
    path: '/profile',
    name: 'profile-page',
    component: ProfilePage,
  },
  {
    path: '/asset/edit',
    name: '',
    component: EditAssetPage,
  },
  {
    path: '/asset/sync',
    name: '',
    component: SyncAssetPage,
  },
  {
    path: '/profile/branch',
    name: '',
    component: EditBranchPage,
  },
];

export default profileRoutes;
