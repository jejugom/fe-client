<template>
  <h2 class="text-primary-300 mb-8 text-2xl font-bold">증여 시뮬레이션 결과</h2>

  <div
    class="bg-gradient-cross-1 mb-4 flex h-80 w-full items-center justify-center"
  >
    <span class="text-white">예시 이미지</span>
  </div>
  <Btn color="secondary" label="결과 공유하기" size="large" />
  <div
    class="fixed bottom-[calc(5rem+1rem)] left-1/2 box-border w-full max-w-150 -translate-x-1/2 px-5"
  >
    <p class="text-primary-300 mb-4 text-center text-base font-semibold">
      더 자세한 설명이 필요하시면<br />
      은행에서 친절하게 도와드립니다.
    </p>

    <Btn color="primary" label="내점 예약하기" size="large" />
  </div>
</template>

<script setup lang="ts">
import Btn from '@/components/buttons/Btn.vue';
</script>

<style scoped></style>
