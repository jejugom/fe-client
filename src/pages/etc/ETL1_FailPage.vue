<template>
  <div class="flex flex-col items-center justify-center gap-8">
    <div class="text-8xl">😔</div>
    <div class="text-center text-lg font-semibold"
      >작업을 처리하는 데 문제가 발생했어요.<br />
      불편을 드려 죄송합니다.<br />
      걱정 마세요, 문제가 곧 해결될거예요.</div
    >
    <BtnSet
      label1="이전 페이지로"
      label2="홈 페이지로"
      :onClick1="goBack"
      :onClick2="goHome"
      type="type1"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import BtnSet from '@/components/buttons/BtnSet.vue';

const router = useRouter();

const goBack = () => {
  router.back();
};

const goHome = () => {
  router.push({ name: 'home' });
};
</script>
