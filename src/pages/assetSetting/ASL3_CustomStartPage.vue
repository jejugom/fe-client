<!-- 개인설정시작 -->
<template>
  <!-- 상단 텍스트 -->
  <div class="mt-24 space-y-8 text-center">
    <p class="text-lg font-semibold">자산 연동이 완료됐습니다!</p>

    <h1 class="text-primary-300 text-2xl font-bold"> 자산 관리 계획 정하기 </h1>

    <div class="text-lg font-semibold">
      <p>자산 계획을 함께 세워볼까요?</p>
      <p>몇 가지 짧은 질문으로</p>
      <p>고객님께 꼭 맞는 서비스를 준비하겠습니다.</p>
    </div>
  </div>

  <!-- 하단 버튼 -->
  <div
    class="fixed bottom-[calc(5rem+1rem)] left-1/2 box-border w-full max-w-150 -translate-x-1/2 px-5"
  >
    <Btn
      @click="goToCustomQuiz"
      color="primary"
      label="시작하기"
      size="large"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import Btn from '@/components/buttons/Btn.vue';

const router = useRouter();

const goToCustomQuiz = () => {
  router.push({ name: 'asset-custom-quiz' });
};
</script>
