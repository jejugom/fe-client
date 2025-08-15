<template>
  <div class="card-design flex flex-col gap-2 p-0 pt-4 pr-4">
    <!-- 상단: 금리 & 영향력 -->
    <div class="ml-4 flex items-center justify-between font-semibold">
      <span class="text-lg">{{ currentRate.toFixed(2) }} % </span>
      <span
        :class="rateDiff > 0 ? 'text-red-300' : 'text-blue-300'"
        class="text-base"
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
const tickPositions = computed(() => [
  new Date('2022-01-01').getTime(),
  new Date('2023-01-01').getTime(),
  new Date('2024-01-01').getTime(),
  new Date('2025-01-01').getTime(),
]);

const series = computed(() => [
  {
    name: '기준금리',
    data: props.interestRateData.map((item) => [
      new Date(item.month).getTime(),
      item.rate,
    ]),
  },
]);

// 차트 옵션
const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    zoom: { enabled: false },
    toolbar: { show: false },
    animations: {
      enabled: false,
      animateGradually: { enabled: false },
      dynamicAnimation: { enabled: false },
    },
  },
  stroke: {
    curve: 'stepline',
    width: 3,
    colors: [lineColor.value],
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number, { dataPointIndex, w }: any) => {
      const timestamp = w.config.series[0].data[dataPointIndex][0];
      const date = new Date(timestamp);
      const yy = String(date.getFullYear()).slice(2);
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yy}-${mm}-${dd}`;
    },
    style: {
      fontSize: '10px',
    },
  },
  tooltip: {
    enabled: true,
    x: {
      formatter: function (value: number) {
        const date = new Date(value);
        const yy = String(date.getFullYear()).slice(2);
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yy}년 ${mm}월 ${dd}일`;
      },
    },
    y: {
      formatter: (val: number) => `${val.toFixed(2)} %`,
    },
  },
  xaxis: {
    type: 'datetime',
    tickAmount: 'dataPoints', // 데이터 개수 기반으로 눈금 생성
    labels: {
      formatter: function (value: number) {
        const date = new Date(value);
        const year = date.getFullYear();
        const month = date.getMonth(); // 0-indexed

        // 무조건 1월인 경우에만 표시
        if (month === 0) {
          return `${year}`;
        }

        // 그 외는 빈 문자열 (레이블 생략)
        return '';
      },
      style: {
        fontSize: '0.625rem',
      },
    },
    axisBorder: { show: true },
    axisTicks: { show: true },
  },
  yaxis: {
    show: true,
  },
  grid: {
    // padding: { top: 0, bottom: 0, left: 0, right: 0 },
  },
}));
</script>
