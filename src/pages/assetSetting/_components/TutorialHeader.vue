<template>
  <div class="mb-16 flex flex-col items-center text-center">
    <img :src="Logo" alt="로고" class="mb-8 h-16" />

    <h1 class="text-primary-500 mb-2 text-2xl font-bold">
      스마트한 노후 준비의 시작
    </h1>
    <p class="text-surface-400">
      복잡한 노후 설계를 쉽고 간편하게<br />
      맞춤형 솔루션으로 안내해드립니다
    </p>
  </div>
</template>

<script setup lang="ts">
import Logo from '@/assets/logos/typo.svg';
</script>
