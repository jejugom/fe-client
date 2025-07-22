import type { RouteRecordRaw } from 'vue-router';
import NohooPage from '@/pages/nohoo/NOL1_NohooPage.vue';
import AllProducts from '@/pages/products/NOL2_AllProducts.vue';
import PersonalizedProducts from '@/pages/nohoo/NOL2_PersonalizedProducts.vue';
import ProductDetailPage from '@/pages/products/NOL3_ProductDetailPage.vue';
import RegisterPage from '@/pages/products/NOL4_RegisterPage.vue';
import RegisterCompletePage from '@/pages/nohoo/NOL5_RegisterCompletePage.vue';

const nohooRoutes: RouteRecordRaw[] = [
  {
    path: '/nohoo',
    name: 'nohoo',
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
  {
    path: '/nohoo/products/:id',
    name: 'product-detail',
    component: ProductDetailPage,
    props: true,
  },
  {
    path: '/nohoo/register/:id',
    name: 'register',
    component: RegisterPage,
  },
  {
    path: '/nohoo/register/complete',
    name: 'register-complete',
    component: RegisterCompletePage,
  },
];

export default nohooRoutes;
