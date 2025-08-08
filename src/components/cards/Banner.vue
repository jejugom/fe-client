<!-- Banner.vue -->
<template>
  <div class="relative left-1/2 w-screen max-w-150 -translate-x-1/2">
    <img :src="Img" alt="배너 이미지" class="h-auto w-full object-cover" />
  </div>
</template>

<script setup lang="ts">
import Img from '@/assets/images/AdBanner.png';
</script>
