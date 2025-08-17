<template>
  <!-- 제목 -->
  <h2 class="text-primary-500 mb-2 text-2xl font-bold">유언장 작성 안내</h2>
  <p class="mb-8">
    남기고 싶은 자산과 마음을 유언장으로 정리해보세요.<br />입력한 정보를
    바탕으로 맞춤 유언장을 만들어드릴게요.
  </p>

  <!-- 시뮬레이션 설명 카드 영역 -->
  <SimulationGuide :guideList="InheritGuideList" />

  <!-- 하단 고정 안내 + 버튼 -->
  <div>
    <Btn
      color="primary"
      label="상속인 정보 입력하기"
      size="large"
      @click="goToInput"
    />
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import Btn from '@/components/buttons/Btn.vue';
import SimulationGuide from '../gift/_components/SimulationGuide.vue';
import { InheritGuideList } from '../../data/simulationGuideData';
const router = useRouter();

// 상속인 정보 입력 페이지로 이동
function goToInput() {
  router.push({ name: 'inheritance-input' });
}
</script>
