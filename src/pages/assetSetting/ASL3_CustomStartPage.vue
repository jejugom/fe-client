<template>
  <div class="flex min-h-[calc(80vh-9rem)] items-center">
    <div
      class="card-design px-auto my-auto flex w-full flex-col items-center justify-center gap-16 py-15"
    >
      <div class="text-center">
        <p class="mb-8 text-lg font-semibold">자산 연동이 완료됐습니다!</p>

        <h1 class="text-primary-300 mb-8 text-2xl font-bold"
          >자산 관리 계획 정하기</h1
        >

        <div class="text-lg font-semibold">
          <p>자산 계획을 함께 세워볼까요?</p>
          <p>몇 가지 짧은 질문으로</p>
          <p>고객님께 꼭 맞는 서비스를 준비하겠습니다.</p>
        </div>
      </div>

      <Btn
        @click="goToCustomQuiz"
        color="primary"
        label="시작하기"
        size="medium"
      /> </div
  ></div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import Btn from '@/components/buttons/Btn.vue';

const router = useRouter();
const route = useRoute();

// 자산 관리 퀴즈 페이지로 이동
function goToCustomQuiz() {
  const fromProfile = route.query.from === 'profile';
  router.push({
    name: 'asset-custom-quiz',
    query: fromProfile ? { from: 'profile' } : {},
  });
}
</script>
