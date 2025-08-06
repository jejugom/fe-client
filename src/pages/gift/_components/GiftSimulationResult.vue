<template>
  <div class="gift-simulation-result mb-4 w-full">
    <div ref="captureTargetRef" class="p-4 font-sans">
      <div class="mb-6">
        <h3 class="mb-2 text-lg font-bold">예상 증여세 총액은?</h3>
        <p class="text-xl font-semibold text-red-300">
          약 {{ formatCurrency(totalGiftTax) }}
        </p>
      </div>

      <div class="mb-6">
        <h3 class="mb-2 text-lg font-semibold">수증자별 세금 요약</h3>
        <table class="border-surface-200 w-full border text-sm">
          <thead class="bg-primary-100">
            <tr>
              <th class="border-surface-200 border p-2">수증자</th>
              <th class="border-surface-200 border p-2">증여금</th>
              <th class="border-surface-200 border p-2">예상 증여세</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(recipient, index) in recipientSummaries" :key="index">
              <td class="border-surface-200 border p-2">
                {{ recipient.name }}
              </td>
              <td class="border-surface-200 border p-2">
                {{ formatCurrency(recipient.giftAmount) }}
              </td>
              <td class="border-surface-200 border p-2">
                {{ formatCurrency(recipient.estimatedTax) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mb-6">
        <h3 class="mb-2 text-lg font-semibold">절세 전략 추천</h3>
        <ul class="list-disc pl-5 text-sm">
          <li v-for="(strategy, index) in taxSavingStrategies" :key="index">
            {{ strategy }}
          </li>
        </ul>
      </div>

      <div class="mb-2">
        <h3 class="mb-2 text-lg font-semibold">증여금 vs 증여세 비교</h3>
        <div class="mt-4">
          <apexchart
            type="bar"
            :options="chartOptions"
            :series="chartSeries"
          ></apexchart>
        </div>
      </div>
    </div>

    <div class="mt-8 flex flex-col items-center justify-center gap-4">
      <Btn
        color="secondary"
        :label="isMobile ? '결과 공유하기 (PDF)' : '결과 PDF 다운로드'"
        size="large"
        @click="handleShareOrDownload"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { formatCurrency } from '@/utils/format';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Btn from '@/components/buttons/Btn.vue';

const apexchart = VueApexCharts;
const captureTargetRef = ref<HTMLElement | null>(null);

// 데스크탑/모바일 환경 구분
const isMobile = ref(false);

const checkDeviceType = () => {
  isMobile.value = /Mobi|Android/i.test(navigator.userAgent);
};

onMounted(() => {
  checkDeviceType();
  window.addEventListener('resize', checkDeviceType);
});

// props로 데이터 받기
const props = defineProps({
  totalGiftTax: {
    type: Number,
    required: true,
  },
  recipientSummaries: {
    type: Array as () => {
      name: string;
      giftAmount: number;
      estimatedTax: number;
    }[],
    required: true,
  },
});

// 절세 전략
const taxSavingStrategies = ref([
  '[전략 1] 증여 시기 분산 전략',
  '[전략 2] 수증자 분산 전략',
  '[전략 3] 자산 분할 증여 전략',
  '[전략 4] 미성년자 증여 제한 전략',
  '[전략 5] 증여자 세금 대납 방지 전략',
  '[전략 6] 세법 변경 리스크 회피 전략',
  '[전략 7] 배우자 공제 활용 전략',
  '[전략 8] 자산별 수증자 매칭 전략',
  '[전략 9] 전문가 상담 유도 전략',
]);

const chartSeries = computed(() => [
  {
    name: '증여금',
    data: props.recipientSummaries.map((r) => r.giftAmount),
  },
  {
    name: '예상 증여세',
    data: props.recipientSummaries.map((r) => r.estimatedTax),
  },
]);

const chartOptions = computed(() => ({
  chart: { type: 'bar', height: 350, toolbar: { show: false } },
  plotOptions: {
    bar: { horizontal: false, columnWidth: '55%', endingShape: 'rounded' },
  },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 2, colors: ['transparent'] },
  xaxis: {
    categories: props.recipientSummaries.map((r) => r.name),
  },
  yaxis: {
    labels: {
      formatter(value: number) {
        return value >= 1e8
          ? (value / 1e8).toFixed(0) + '억 원'
          : value >= 1e4
            ? (value / 1e4).toFixed(0) + '만 원'
            : formatCurrency(value);
      },
    },
  },
  fill: { opacity: 1 },
  tooltip: {
    y: {
      formatter(val: number) {
        return formatCurrency(val) + '원';
      },
    },
  },
  colors: ['#93C5FD', '#2563EB'],
  animations: {
    enabled: false,
  },
}));

// PDF 생성 및 다운로드/공유 로직
const generateAndDownloadPDF = async () => {
  if (!captureTargetRef.value) return;

  await nextTick();
  await document.fonts.ready;

  try {
    const canvas = await html2canvas(captureTargetRef.value, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });
    const imgData = canvas.toDataURL('image/png');

    // A4 크기 대신 캔버스 비율 기반 사이즈 계산
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: [canvas.width, canvas.height], // 핵심 부분
    });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

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
  generateAndDownloadPDF();
};
</script>

<style>
/* 폰트 관련 CSS는 이전과 동일 */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap');

.gift-simulation-result {
  font-family: 'Noto Sans KR', sans-serif;
}
</style>
