<template>
  <div class="border-primary-300 flex flex-col gap-2 rounded-xl border p-4">
    <div class="flex items-center justify-between font-semibold">
      <span class="text-lg">
        {{ currentPrice.toLocaleString() }}
        <span class="font-regular text-surface-300 text-sm"> (원/toz)</span>
      </span>
      <span :class="priceDiff > 0 ? 'text-red-300' : 'text-blue-300'">
        {{ priceDiff > 0 ? '▲' : '▼' }}
        {{ Math.abs(priceDiff).toLocaleString() }} ({{
          Math.abs(priceRate).toFixed(2)
        }}%)
      </span>
    </div>
    <apexchart type="line" :options="chartOptions" :series="series" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { fetchGoldPrice } from '@/api/gold';
import type { GoldPrice } from '@/api/gold';

// 1. 금 시세 상태
const goldPrices = ref<GoldPrice[]>([]);

// 2. 데이터 불러오기
onMounted(async () => {
  try {
    goldPrices.value = await fetchGoldPrice();
  } catch (e) {
    console.error('금 시세 불러오기 실패:', e);
  }
});

// 3. 최근 시세 비교용
const latest = computed(() => goldPrices.value.at(-1));
const previous = computed(() => goldPrices.value.at(-2));

const currentPrice = computed(() => latest.value?.price ?? 0);
const priceDiff = computed(() =>
  latest.value && previous.value ? latest.value.price - previous.value.price : 0
);
const priceRate = computed(() =>
  latest.value && previous.value
    ? (priceDiff.value / previous.value.price) * 100
    : 0
);

// 4. 차트 데이터 가공
const formattedDates = computed(
  () => goldPrices.value.map((item) => item.date.slice(2)) // 예: "25-07-28"
);
const prices = computed(() => goldPrices.value.map((item) => item.price));

const maxIndex = computed(() =>
  prices.value.indexOf(Math.max(...prices.value))
);
const minIndex = computed(() =>
  prices.value.indexOf(Math.min(...prices.value))
);
const lastIndex = computed(() => prices.value.length - 1);

// 5. 차트 시리즈
const series = computed(() => [
  {
    name: '금 시세',
    data: prices.value,
  },
]);

// 6. 색상 동적 적용
const lineColor = computed(
  () =>
    priceDiff.value > 0
      ? 'oklch(0.568 0.2002 26.41)' // red-300
      : 'oklch(0.5134 0.1603 255.67)' // blue-300
);

// 7. 차트 옵션
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
        dataPointIndex === maxIndex.value ||
        dataPointIndex === minIndex.value ||
        dataPointIndex === lastIndex.value
      ) {
        return formattedDates.value[dataPointIndex];
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
      formatter: (val: number) => `${val.toLocaleString()} USD`,
    },
  },
  xaxis: {
    categories: formattedDates.value,
    axisBorder: { show: true },
    axisTicks: { show: true },
    tooltip: { enabled: false },
  },
  yaxis: {
    show: false,
  },
  grid: {
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  },
}));
</script>
