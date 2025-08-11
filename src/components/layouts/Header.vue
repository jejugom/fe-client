<template>
  <header class="relative flex h-16 items-center justify-center bg-white">
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
      <img :src="Logo" alt="노후도락 로고" class="h-6 w-auto" />
    </router-link>
  </header>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';
import Arrow from '@/assets/icons/HeaderBefore.svg';
import Logo from '@/assets/logos/typo.svg';

const router = useRouter();
const route = useRoute();

const goBack = () => {
  const referrer = document.referrer;

  const isInternal = referrer.includes(window.location.host);

  if (isInternal) {
    router.back(); // 내부에서 온 경우 → 히스토리 뒤로 이동
  } else {
    router.push({ name: 'home' }); // 외부에서 온 경우 → 홈으로
  }
};

const showBackBtn = computed(() => {
  return !['home', 'not-found', 'fail', 'loading'].includes(
    route.name as string
  );
});
</script>
