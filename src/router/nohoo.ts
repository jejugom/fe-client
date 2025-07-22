import type { RouteRecordRaw } from 'vue-router';
import NohooPage from '@/pages/nohoo/NohooPage.vue';
import AllProducts from '@/pages/products/AllProducts.vue';
import PersonalizedProducts from '@/pages/products/PersonalizedProducts.vue';

const nohooRoutes: RouteRecordRaw[] = [
  {
    path: '/nohoo',
    name: 'nohoo-page',
    component: NohooPage,
  },
  {
    path: '/nohoo/products',
    name: 'all-products',
    component: AllProducts,
  },
  {
    path: '/nohoo/products/personalized',
    name: 'personalized-product',
    component: PersonalizedProducts,
  },
];

export default nohooRoutes;
