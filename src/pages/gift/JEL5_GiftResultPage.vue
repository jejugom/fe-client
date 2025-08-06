<template>
  <h2 class="text-primary-300 mb-8 text-2xl font-bold">증여 시뮬레이션 결과</h2>

  <div ref="pdfRef" class="mb-4">
    <GiftSimulationResult />
  </div>
  <Btn color="secondary" label="가족과 결과 함께 보기" size="large" />
  <div class="mt-16 flex flex-col">
    <p class="text-primary-300 mb-2 text-center font-semibold">
      궁금한 점이 생기셨다면,<br />
      은행에서 자세히 알려드릴게요
    </p>

    <Btn
      color="primary"
      label="은행 방문 예약하기"
      size="large"
      @click="goToRegister"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Btn from '@/components/buttons/Btn.vue';
import { useRouter } from 'vue-router';
// import { useGiftStore } from '@/stores/gift'; // 기존
import { useSimulationStore } from '@/stores/simulation'; // 변경

const router = useRouter();
// const giftStore = useGiftStore(); // 기존
const simulationStore = useSimulationStore(); // 변경

const goToRegister = () => {
  router.push({
    name: 'register',
    params: { id: 'gift' },
  });
};

import GiftSimulationResult from './_components/GiftSimulationResult.vue';
</script>
