<template>
  <div
    class="bg-primary-100 relative left-1/2 mt-[-1.125rem] min-h-screen w-screen max-w-150 -translate-x-1/2 px-4 py-8"
  >
    <div class="mx-auto max-w-md">
      <TutorialHeader />
      <ServiceIntro />
      <UsageSteps />

      <!-- 시작하기 버튼 -->
      <div class="space-y-4">
        <Btn
          label="노후 설계 시작하기"
          color="secondary"
          size="large"
          @click="handleStart"
        />

        <p class="text-surface-500 text-center text-xs">
          무료로 시작하고 언제든지 중단할 수 있어요
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import TutorialHeader from './_components/TutorialHeader.vue';
import ServiceIntro from './_components/ServiceIntro.vue';
import UsageSteps from './_components/UsageSteps.vue';
import Btn from '@/components/buttons/Btn.vue';

const router = useRouter();

const handleStart = () => {
  // console.log('시작하기 버튼 클릭됨');
  router.push({ name: 'asset-start' });
};
</script>
