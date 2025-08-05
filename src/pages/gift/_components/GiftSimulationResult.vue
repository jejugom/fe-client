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
        :label="isMobile ? '결과 공유하기' : '결과 이미지 다운로드'"
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

// 이미지 저장 로직
const saveAsImage = async () => {
  if (!captureTargetRef.value) return;

  await nextTick();
  await document.fonts.ready;

  try {
    const canvas = await html2canvas(captureTargetRef.value, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const imageURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = '증여_시뮬레이션_결과.png';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert('결과 이미지가 다운로드되었습니다.');
  } catch (error) {
    console.error('이미지 저장 실패:', error);
    alert('이미지 저장에 실패했습니다.');
  }
};

// 이미지 공유 로직
const shareImage = async () => {
  if (!captureTargetRef.value) return;

  await nextTick();
  await document.fonts.ready;

  try {
    const canvas = await html2canvas(captureTargetRef.value, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const imageURL = canvas.toDataURL('image/png');

    const response = await fetch(imageURL);
    const blob = await response.blob();
    const file = new File([blob], '증여_시뮬레이션_결과.png', {
      type: 'image/png',
    });

    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        title: '증여 시뮬레이션 결과',
        text: '시뮬레이션 결과를 확인해보세요.',
        files: [file],
      });
    } else {
      // 웹 공유 API를 지원하지 않을 경우 다운로드로 대체
      saveAsImage();
    }
  } catch (error) {
    console.error('이미지 공유 실패:', error);
    alert('이미지 공유에 실패했습니다. 다운로드 기능을 사용해주세요.');
  }
};

const handleShareOrDownload = () => {
  if (isMobile.value) {
    shareImage();
  } else {
    saveAsImage();
  }
};
</script>

<style>
/* 폰트 관련 CSS는 이전과 동일 */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap');

.gift-simulation-result {
  font-family: 'Noto Sans KR', sans-serif;
}
</style>
