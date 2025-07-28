<template>
  <div class="border-primary-300 flex flex-col gap-2 rounded-xl border p-4">
    <div class="flex items-center justify-between font-semibold">
      <span class="text-lg">
        {{ currentPrice.toLocaleString() }}
        <span class="font-regular text-surface-300 text-sm"> (원/돈)</span>
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
import { fetchExchangeRate } from '@/api/exchange';

const goldPrices = ref<GoldPrice[]>([]);
const exchangeRate = ref(1); // 기본값: USD 그대로
const tozDon = 3.75 / 31.1035; // 1 온스 = 31.1035g, 1 온스 = 3.75돈

// 1. 데이터 불러오기

onMounted(async () => {
  try {
    const [goldData, rate] = await Promise.all([
      fetchGoldPrice(),
      fetchExchangeRate(),
    ]);
    goldPrices.value = goldData;
    exchangeRate.value = rate;
  } catch (e) {
    console.error('시세 로딩 실패:', e);
  }
});

// 2. 변환 함수 (USD/toz → KRW/돈)
const toDonKRW = (usdToz: number): number =>
  usdToz * tozDon * exchangeRate.value;

// 3. 최근 시세 비교용
const latest = computed(() => goldPrices.value.at(-1));
const previous = computed(() => goldPrices.value.at(-2));

const priceDiff = computed(() =>
  latest.value && previous.value
    ? toDonKRW(latest.value.price - previous.value.price)
    : 0
);

const priceRate = computed(() =>
  latest.value && previous.value
    ? (priceDiff.value / toDonKRW(previous.value.price)) * 100
    : 0
);

// 4. 차트 데이터 가공
const formattedDates = computed(
  () => goldPrices.value.map((item) => item.date.slice(2)) // 예: "25-07-28"
);

const prices = computed(() =>
  goldPrices.value.map((item) => toDonKRW(item.price))
);

const currentPrice = computed(() =>
  latest.value ? toDonKRW(latest.value.price) : 0
);

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
      formatter: (val: number) => `${Math.round(val).toLocaleString()} 원`,
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
