<template>
  <div ref="pdfRef">
    <GiftSimulationResult />
  </div>
  <p class="text-surface-300 mb-4"
    >이 결과는 <strong>참고용 시뮬레이션</strong>이며, 실제 세액은 세무사 상담
    후 확정됩니다. <br />정확한 세액 계산과 절세 전략 수립을 위해서는 전문가와의
    상담을 권장합니다.</p
  >
  <Btn
    class="mb-4"
    color="secondary"
    :label="isMobile ? '결과 공유하기 (PDF)' : '결과 PDF 다운로드'"
    size="large"
    @click="handleShareOrDownload"
  />

  <div class="mt-4">
    <p class="text-primary-500 mb-2 text-center font-semibold">
      궁금한 점이 생기셨다면,<br />
      은행에서 자세히 알려드릴게요
    </p>

    <Btn
      class="mb-4"
      color="primary"
      label="은행 방문 예약하기"
      size="large"
      @click="goToRegister"
    />

    <Btn
      color="primary"
      label="증여설계 메인으로 돌아가기"
      size="large"
      @click="goToMain"
    />
  </div>

  <Alert v-if="showAlert" @click="showAlert = false">
    <p>{{ alertMessage }}</p>
  </Alert>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Btn from '@/components/buttons/Btn.vue';
import Alert from '@/components/modals/Alert.vue';
import { useRouter } from 'vue-router';
import GiftSimulationResult from './_components/GiftSimulationResult.vue';
import { generateAndSharePdf } from '@/utils/pdf';

const router = useRouter();

// 데스크탑/모바일 환경 구분
const isMobile = ref(false);
const showAlert = ref(false);
const alertMessage = ref('');

// 디바이스 타입 체크
function checkDeviceType() {
  isMobile.value = /Mobi|Android/i.test(navigator.userAgent);
}

// 컴포넌트 마운트 시 디바이스 타입 체크
onMounted(() => {
  checkDeviceType();
  window.addEventListener('resize', checkDeviceType);
});

const pdfRef = ref<HTMLElement | null>(null);

function goToRegister() {
  router.push({
    name: 'register',
    params: { id: 'gift' },
  });
}

const goToMain = () => {
  router.push({ name: 'gift' });
};

// 결과 공유 또는 다운로드 핸들러
async function handleShareOrDownload() {
  if (!pdfRef.value) return;

  const result = await generateAndSharePdf({
    element: pdfRef.value,
    fileName: '증여_시뮬레이션_결과.pdf',
    shareTitle: '증여 시뮬레이션 결과',
    shareText: '시뮬레이션 결과를 PDF로 확인해보세요.',
  });

  if (!result.success || result.message) {
    alertMessage.value = result.message;
    showAlert.value = true;
  }
}
</script>
