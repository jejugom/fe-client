<template>
  <h2 class="text-primary-300 mb-8 text-2xl font-bold">증여 시뮬레이션 결과</h2>

  <div ref="pdfRef" class="mb-4 bg-white">
    <GiftSimulationResult
      :totalGiftTax="simulationData.totalGiftTax"
      :recipientSummaries="simulationData.recipientSummaries"
    />
  </div>

  <div class="mt-8 text-center">
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
import { useRouter } from 'vue-router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import GiftSimulationResult from './_components/GiftSimulationResult.vue';
import Btn from '@/components/buttons/Btn.vue';

const router = useRouter();
const pdfRef = ref<HTMLElement | null>(null);

// 시뮬레이션 데이터를 담을 ref
const simulationData = ref({
  totalGiftTax: 0,
  recipientSummaries: [],
});

// 페이지 이동
const goToRegister = () => {
  router.push({ name: 'register', params: { id: 'gift' } });
};

// PDF 다운로드 함수
const downloadPDF = async () => {
  if (!pdfRef.value) return;

  const doc = new jsPDF('p', 'mm', 'a4');

  await doc.html(pdfRef.value, {
    callback: (pdf) => {
      pdf.save('gift-simulation.pdf');
    },
    margin: [10, 10, 10, 10],
    html2canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    },
  });
};

onMounted(() => {
  // 라우터 state에서 데이터 가져와서 `simulationData`에 할당
  const historyState = window.history.state;
  if (historyState && historyState.totalGiftTax !== undefined) {
    simulationData.value.totalGiftTax = historyState.totalGiftTax;
    simulationData.value.recipientSummaries = historyState.recipientSummaries;
  }
});
</script>
