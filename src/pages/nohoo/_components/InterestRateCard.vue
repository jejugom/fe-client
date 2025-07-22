<template>
  <div class="border-primary-300 flex flex-col gap-2 rounded-xl border p-4">
    <!-- 상단: 금리 & 영향력 -->
    <div class="flex items-center justify-between font-semibold">
      <span class="text-lg">{{ currentRate.toFixed(2) }} % </span>
      <span
        :class="rateDiff > 0 ? 'text-red-300' : 'text-blue-300'"
        class="text-sm"
      >
        {{ rateDiff > 0 ? '▲' : '▼' }} {{ Math.abs(rateDiff).toFixed(2) }}%
      </span>
    </div>

    <!-- 차트 -->
    <apexchart type="line" :options="chartOptions" :series="series" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  interestRateData: {
    month: string;
    rate: number;
  }[];
}>();

// 최근 금리 비교
const latest = props.interestRateData.at(-1);
const previous = props.interestRateData.at(-2);

const currentRate = latest?.rate ?? 0;
const rateDiff = latest && previous ? latest.rate - previous.rate : 0;

// 라인 색상 동적 설정
const lineColor = computed(
  () =>
    rateDiff > 0
      ? 'oklch(0.568 0.2002 26.41)' /* red-300 */
      : 'oklch(0.5134 0.1603 255.67)' /* blue-300 */
);

// 데이터 series
const formattedDates = props.interestRateData.map((item) => {
  const [year, month] = item.month.split('-');
  // return `${year.slice(2)}/${month}`;
  return `${month}`;
});
const rates = props.interestRateData.map((item) => item.rate);
const maxIndex = rates.indexOf(Math.max(...rates));
const minIndex = rates.indexOf(Math.min(...rates));
const lastIndex = rates.length - 1;
const series = computed(() => [
  {
    name: '기준금리',
    data: rates,
  },
]);

// 차트 옵션
const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    zoom: { enabled: false },
    toolbar: { show: false },
  },
  stroke: {
    width: 3,
    colors: [lineColor.value],
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number, { dataPointIndex }: any) => {
      if (
        dataPointIndex === maxIndex ||
        dataPointIndex === minIndex ||
        dataPointIndex === lastIndex
      ) {
        return `${formattedDates[dataPointIndex]}`;
      }
      return '';
    },
    style: {
      fontSize: '0.625rem',
    },
    background: {
      enabled: true,
      borderRadius: 4,
      dropShadow: { enabled: false },
    },
  },
  tooltip: {
    enabled: true,
    y: {
      formatter: (val: number) => `${val.toFixed(2)} %`,
    },
  },
  xaxis: {
    categories: formattedDates,
    labels: {
      show: true,
    },
    axisBorder: { show: true },
    axisTicks: { show: true },
    tooltip: { enabled: false },
    floating: false,
  },
  yaxis: {
    show: false,
  },
  grid: {
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  },
}));
</script>
