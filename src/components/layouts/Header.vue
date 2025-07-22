<template>
  <header
    class="relative flex h-16 items-center justify-center bg-white shadow-xs"
  >
    <!-- 뒤로가기 -->
    <img
      v-if="showBackBtn"
      :src="Arrow"
      alt="뒤로가기 아이콘"
      class="absolute left-5 h-6 w-6"
      @click="goBack"
    />

    <!-- 로고 텍스트 -->
    <router-link :to="{ name: 'home' }" class="text-2xl font-bold">
      <span class="text-primary-300">노후</span>
      <span class="text-secondary-300">도락</span>
    </router-link>
  </header>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';
import Arrow from '@/assets/icons/HeaderBefore.svg';

const router = useRouter();
const route = useRoute();

const goBack = () => {
  router.back();
};

const showBackBtn = computed(() => {
  return !['home', 'not-found', 'fail', 'loading'].includes(
    route.name as string
  );
});
</script>
