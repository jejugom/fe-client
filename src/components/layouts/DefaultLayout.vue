<template>
  <div class="bg-surface-200 relative flex min-h-screen flex-col items-center">
    <!-- 상단 고정 헤더 -->
    <Header class="sticky top-0 z-50 w-full max-w-[600px]" />

    <!-- 본문 영역 -->
    <main
      class="relative w-full max-w-[600px] flex-1 bg-[#fcfcfc] p-[20px] pb-[60px]"
    >
      <router-view />
      <Floating />
      <LoadingPage v-if="loadingStore.isLoading" />
      <FailPage v-else-if="loadingStore.hasError" />
    </main>
    <footer class="relative w-full max-w-[600px] flex-1"> <Footer /></footer>

    <!-- 하단 고정 탭바 -->
    <TabBar
      v-if="authStore.isLogin && !isInTutorial"
      class="sticky bottom-0 z-50 w-full max-w-[600px]"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useLoadingStore } from '@/stores/loading';
import { useAuthStore } from '@/stores/auth';
import Header from './Header.vue';
import TabBar from './TabBar.vue';
import LoadingPage from '@/pages/etc/ETL1_LoadingPage.vue';
import FailPage from '@/pages/etc/ETL1_FailPage.vue';
import Floating from './Floating.vue';
import Footer from './Footer.vue';

const route = useRoute();
const loadingStore = useLoadingStore();
const authStore = useAuthStore();

// 튜토리얼 페이지들에서는 탭바를 숨김 (단, profile에서 진입한 경우는 제외)
const tutorialRoutes = [
  'asset-tutorial',
  'asset-start', 
  'asset-kookmin-login',
  'asset-custom-start',
  'asset-custom-quiz'
];

const isInTutorial = computed(() => {
  const currentRoute = route.name as string;
  const fromProfile = route.query.from === 'profile';
  
  // 튜토리얼 페이지이면서 profile에서 온 것이 아닌 경우에만 탭바 숨김
  return tutorialRoutes.includes(currentRoute) && !fromProfile;
});
</script>
