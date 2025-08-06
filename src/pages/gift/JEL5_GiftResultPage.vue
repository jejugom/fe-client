<template>
  <h2 class="text-primary-300 mb-8 text-2xl font-bold">증여 시뮬레이션 결과</h2>

  <div ref="pdfRef" class="mb-4">
    <GiftSimulationResult />
  </div>
  <Btn
    color="secondary"
    :label="isMobile ? '결과 공유하기 (PDF)' : '결과 PDF 다운로드'"
    size="large"
    @click="handleShareOrDownload"
  />
  <div class="mt-16">

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
import { ref, onMounted, nextTick } from 'vue';
import Btn from '@/components/buttons/Btn.vue';
import { useRouter } from 'vue-router';
import { useSimulationStore } from '@/stores/simulation'; // 변경
import GiftSimulationResult from './_components/GiftSimulationResult.vue';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const router = useRouter();
// const giftStore = useGiftStore(); // 기존
const simulationStore = useSimulationStore(); // 변경

// 데스크탑/모바일 환경 구분
const isMobile = ref(false);

const checkDeviceType = () => {
  isMobile.value = /Mobi|Android/i.test(navigator.userAgent);
};

onMounted(() => {
  checkDeviceType();
  window.addEventListener('resize', checkDeviceType);
});

const pdfRef = ref<HTMLElement | null>(null);

const goToRegister = () => {
  router.push({
    name: 'register',
    params: { id: 'gift' },
  });
};

const shareResult = async () => {
  if (!pdfRef.value) return;

  await nextTick();
  await document.fonts.ready;

  try {
    const canvas = await html2canvas(pdfRef.value, {
      scale: 2,
      useCORS: true,
      // allowTaint: true,
    });
    const imgData = canvas.toDataURL('image/png');

    // A4 크기 대신 캔버스 비율 기반 사이즈 계산
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: [canvas.width, canvas.height], // 핵심 부분
    });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

    // 워터마크 삽입
    pdf.setTextColor(200);
    pdf.setFontSize(20);
    pdf.text('NoHudorak', canvas.width / 2, canvas.height / 2, {
      align: 'center',
      angle: 45,
    });

    const pdfBlob = pdf.output('blob');
    const file = new File([pdfBlob], '증여_시뮬레이션_결과.pdf', {
      type: 'application/pdf',
    });

    if (isMobile.value && navigator.canShare?.({ files: [file] })) {
      // 모바일에서 공유
      await navigator.share({
        title: '증여 시뮬레이션 결과',
        text: '시뮬레이션 결과를 PDF로 확인해보세요.',
        files: [file],
      });
    } else {
      // 데스크탑 또는 공유가 불가능한 경우 다운로드
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfBlob);
      link.download = '증여_시뮬레이션_결과.pdf';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      alert(
        isMobile.value
          ? '공유 기능을 사용할 수 없어 PDF를 다운로드합니다.'
          : '결과 PDF가 다운로드되었습니다.'
      );
    }
  } catch (error) {
    console.error('PDF 생성/공유 실패:', error);
    alert('결과를 공유하거나 저장하는 데 실패했습니다.');
  }
};

const handleShareOrDownload = () => {
  shareResult();
};

</script>
