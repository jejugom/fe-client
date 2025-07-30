import type { RouteRecordRaw } from 'vue-router';

const productRoutes: RouteRecordRaw[] = [
  {
    path: '/products/:id',
    name: 'product-detail',
    component: () => import('@/pages/products/NOL3_ProductDetailPage.vue'),
    props: true,
  },
  {
    path: '/register/:id',
    name: 'register',
    component: () => import('@/pages/products/NOL4_RegisterPage.vue'),
  },
  {
    path: '/register/complete/:type?',
    name: 'register-complete',
    component: () => import('@/pages/products/NOL5_RegisterCompletePage.vue'),
  },
];

export default productRoutes;
