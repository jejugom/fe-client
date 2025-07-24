import type { RouteRecordRaw } from 'vue-router';

const nohooRoutes: RouteRecordRaw[] = [
  {
    path: '/nohoo',
    name: 'nohoo',
    component: () => import('@/pages/nohoo/NOL1_NohooPage.vue'),
  },
  {
    path: '/nohoo/products',
    name: 'all-products',
    component: () => import('@/pages/products/NOL2_AllProducts.vue'),
  },
  {
    path: '/nohoo/products/personalized',
    name: 'personalized-product',
    component: () => import('@/pages/nohoo/NOL2_PersonalizedProducts.vue'),
  },
  {
    path: '/nohoo/products/:id',
    name: 'product-detail',
    component: () => import('@/pages/products/NOL3_ProductDetailPage.vue'),
    props: true,
  },
  {
    path: '/nohoo/register/:id',
    name: 'register',
    component: () => import('@/pages/products/NOL4_RegisterPage.vue'),
  },
  {
    path: '/nohoo/register/complete',
    name: 'register-complete',
    component: () => import('@/pages/nohoo/NOL5_RegisterCompletePage.vue'),
  },
];

export default nohooRoutes;
