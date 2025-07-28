<template>
  <h2 class="text-primary-300 mb-8 text-2xl font-bold">증여 시뮬레이션 결과</h2>

  <div
    class="bg-gradient-cross-1 mb-4 flex h-80 w-full items-center justify-center"
  >
    <span class="text-white">예시 이미지</span>
  </div>
  <Btn color="secondary" label="가족과 결과 함께 보기" size="large" />
  <div
    class="fixed bottom-[calc(5rem+1rem)] left-1/2 box-border w-full max-w-150 -translate-x-1/2 px-5"
  >
    <p class="text-primary-300 mb-2 text-center font-semibold">
      궁금한 점이 생기셨다면,<br />
      은행 창구에서 자세히 알려드릴게요
    </p>

    <Btn
      color="primary"
      label="은행 방문 예약하기"
      size="large"
      @click="goToRegister"
    />
  </div>
</template>

<script setup lang="ts">
import Btn from '@/components/buttons/Btn.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToRegister = () => {
  router.push({
    name: 'register',
    params: { id: 'gift' },
  });
};
</script>
