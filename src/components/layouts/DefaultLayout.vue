<template>
  <div class="bg-surface-100 relative flex min-h-screen flex-col items-center">
    <!-- 로딩 오버레이 -->
    <ETL1_LoadingPage v-if="isLoading" />

    <!-- 상단 고정 헤더 -->
    <Header class="sticky top-0 z-50 w-full max-w-[600px]" />

    <!-- 본문 영역 -->
    <main class="w-full max-w-[600px] flex-1 bg-white px-5 py-10">
      <slot />
    </main>

    <!-- 하단 고정 탭바 -->
    <TabBar class="sticky bottom-0 z-50 w-full max-w-[600px]" />
  </div>
</template>

<script setup lang="ts">
import { useLoadingStore } from '@/stores/loading';
import { storeToRefs } from 'pinia';

import Header from './Header.vue';
import TabBar from './TabBar.vue';
import ETL1_LoadingPage from '@/pages/etc/ETL1_LoadingPage.vue';

const { isLoading } = storeToRefs(useLoadingStore());
</script>
