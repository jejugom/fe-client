<template>
  <div class="space-y-16">
    <div class="space-y-4">
      <div class="text-primary-300 text-2xl font-bold">오늘의 도전</div>
      <ChallengeCarousel />
    </div>
    <div class="space-y-4">
      <div class="text-primary-300 bg-white text-2xl font-bold"
        >챌린지 현황</div
      >
      <ChallengeState />
      <Btn color="primary" label="보상 선택하기" size="large" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ChallengeCarousel from './_components/ChallengeCarousel.vue';
import Btn from '@/components/buttons/Btn.vue';
import ChallengeState from './_components/ChallengeState.vue';
</script>
