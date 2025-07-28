<template>
  <div class="flex flex-col items-center justify-center gap-8">
    <div class="text-8xl">😔</div>
    <div class="text-center text-lg font-semibold"
      >작업 중 문제가 생겼습니다.<br />
      정보를 불러오는 데 시간이 걸리고 있어요.<br />
      불편하시더라도 잠시 후 다시 시도해주세요.</div
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
