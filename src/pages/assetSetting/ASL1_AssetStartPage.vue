<!-- 자산연동시작 -->
<template>
  <div class="flex min-h-[calc(80vh-9rem)] items-center">
    <div
      class="stroke-primary px-auto my-auto flex w-full flex-col items-center justify-center gap-16 rounded-lg bg-white py-15"
    >
      <h1 class="text-primary-300 text-2xl font-bold">
        {{ authStore.userName || authStore.username }}님, 안녕하세요!
      </h1>
      <div class="text-surface-500 text-center text-lg font-semibold">
        <p>더 정확한 서비스 제공을 위해서</p>
        <p><span class="text-primary-300">자산 연동</span>을 진행하겠습니다.</p>
      </div>

      <Btn
        @click="goToKookminLogin"
        color="primary"
        label="시작하기"
        size="medium"
      /> </div
  ></div>
</template>

<script setup lang="ts">
import Btn from '@/components/buttons/Btn.vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const goToKookminLogin = () => {
  // 현재 route의 쿼리 파라미터 확인
  const isFromProfile = route.query.from === 'profile';

  // 쿼리 파라미터가 있다면 다음 페이지로도 전달
  router.push({
    name: 'asset-kookmin-login',
    query: isFromProfile ? { from: 'profile' } : {},
  });
};
</script>
