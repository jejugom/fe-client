<template>
  <!-- 제목 -->
  <h2 class="text-primary-500 mb-2 text-2xl font-bold">증여 시뮬레이션 안내</h2>
  <p class="mb-8">
    복잡한 증여 세금, 어렵죠? <br />
    간단한 입력만으로 세금을 예측하고 절세 전략까지 확인해보세요.
  </p>

  <!-- 시뮬레이션 설명 카드 영역 -->
  <SimulationGuide :guideList="GiftGuideList" />

  <!-- 하단 고정 안내 + 버튼 -->
  <div>
    <Btn
      color="primary"
      label="수증자 정보 입력하기"
      size="large"
      @click="goToInput"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import Btn from '@/components/buttons/Btn.vue';
import SimulationGuide from './_components/SimulationGuide.vue';
import { GiftGuideList } from './SimulationGuideData';

const router = useRouter();

function goToInput() {
  router.push({ name: 'gift-input' });
}
</script>
