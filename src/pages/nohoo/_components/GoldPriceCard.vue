<template>
  <div class="border-primary-300 flex flex-col gap-2 rounded-xl border p-4">
    <div class="flex items-center justify-between font-semibold">
      <span class="text-lg"
        >{{ currentPrice.toLocaleString() }}
        <span class="font-regular text-surface-300 text-sm"> (원/g)</span>
      </span>
      <span :class="priceDiff > 0 ? 'text-red-300' : 'text-blue-300'"
        >{{ priceDiff > 0 ? '▲' : '▼' }}
        {{ Math.abs(priceDiff).toLocaleString() }}
        ({{ Math.abs(priceRate).toFixed(2) }}%)</span
      >
    </div>
    <apexchart type="line" :options="chartOptions" :series="series" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  goldPriceData: {
    month: string;
    price: number;
  }[];
}>();

// 최근 금 시세 비교
const latest = props.goldPriceData.at(-1);
const previous = props.goldPriceData.at(-2);

const currentPrice = latest?.price ?? 0;
const priceDiff = latest && previous ? latest.price - previous.price : 0;
const priceRate = latest && previous ? (priceDiff / previous.price) * 100 : 0;

// 라인 색상 동적 설정
const lineColor = computed(
  () =>
    priceDiff > 0
      ? 'oklch(0.568 0.2002 26.41)' /* red-300 */
      : 'oklch(0.5134 0.1603 255.67)' /* blue-300 */
);

// 데이터 series
const formattedDates = props.goldPriceData.map((item) => {
  const [year, month] = item.month.split('-');
  return `${year.slice(2)}/${month}`;
});
const prices = props.goldPriceData.map((item) => item.price);
const maxIndex = prices.indexOf(Math.max(...prices));
const minIndex = prices.indexOf(Math.min(...prices));
const lastIndex = prices.length - 1;
const series = computed(() => [
  {
    name: '금 시세',
    data: prices,
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
      formatter: (val: number) => `${val.toLocaleString()} 원`,
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
