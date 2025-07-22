<!-- 개인설정시작 -->
<template>
  <div class="flex min-h-screen items-center justify-center px-4">
    <div
      class="border-surface-200 w-full max-w-md rounded-3xl border bg-white p-12"
    >
      <div class="mb-16 space-y-8 text-center">
        <h2 class="text-xl font-semibold"> 자산 연동이 완료됐습니다! </h2>
        <div class="space-y-4">
          <h1 class="text-primary-300 text-2xl font-bold">
            자산 관리 계획 정하기
          </h1>
          <p>자산 계획을 함께 세워볼까요?</p>
          <p>몇 가지 짧은 질문으로</p>
          <p>고객님께 꼭 맞는 서비스를 준비하겠습니다.</p>
        </div>
      </div>

      <div class="flex justify-center pt-4">
        <Btn
          @click="goToCustomQuiz"
          color="primary"
          label="시작하기"
          size="medium"
        />
      </div>
    </div>
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
