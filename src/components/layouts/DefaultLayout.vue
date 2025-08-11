<template>
  <div class="bg-surface-200 relative flex min-h-screen flex-col items-center">
    <!-- 상단 고정 헤더 -->
    <Header class="sticky top-0 z-50 w-full max-w-[600px]" />

    <!-- 본문 영역 -->
    <main class="relative w-full max-w-[600px] flex-1 bg-[#fcfcfc] p-5">
      <router-view />
      <Floating />
      <LoadingPage v-if="loadingStore.isLoading" />
      <FailPage v-else-if="loadingStore.hasError" />
    </main>

    <!-- 하단 고정 탭바 -->
    <TabBar
      v-if="authStore.isLogin"
      class="sticky bottom-0 z-50 w-full max-w-[600px]"
    />
  </div>
</template>

<script setup lang="ts">
import { useLoadingStore } from '@/stores/loading';
import { useAuthStore } from '@/stores/auth';
import Header from './Header.vue';
import TabBar from './TabBar.vue';
import LoadingPage from '@/pages/etc/ETL1_LoadingPage.vue';
import FailPage from '@/pages/etc/ETL1_FailPage.vue';
import Floating from './Floating.vue';

const loadingStore = useLoadingStore();
const authStore = useAuthStore();
</script>
