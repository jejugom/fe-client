<template>
  <div class="flex-1 px-4"
    ><h2 class="text-primary-300 mb-8 text-2xl font-bold"
      >증여 시뮬레이션 결과</h2
    >

    <div
      class="bg-gradient-cross-1 mb-4 flex h-80 w-full items-center justify-center"
    >
      <span class="text-surface-500">예시 이미지</span>
    </div>
    <div class="flex flex-col gap-3">
      <Btn color="secondary" label="결과 공유하기" size="large" />
      <Btn color="primary" label="내점 예약하기" size="large" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Btn from '@/components/buttons/Btn.vue';
</script>

<style scoped></style>
