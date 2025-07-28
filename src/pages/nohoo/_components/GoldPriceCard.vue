<template>
  <div class="border-primary-300 flex flex-col gap-2 rounded-xl border p-4">
    <div class="flex items-center justify-between font-semibold">
      <span class="text-lg">
        {{ Math.round(currentPrice).toLocaleString() }}
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

// 데이터 불러오기

onMounted(async () => {
  try {
    const [goldData, rate] = await Promise.all([
      fetchGoldPrice(),
      fetchExchangeRate(),
    ]);
    // 실제로 어떤 데이터가 들어오는지 확인
    console.log('Gold Data:', goldData);
    console.log('Exchange Rate:', rate);

    // 3개월 데이터 필터링
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);

    const filteredData = goldData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= threeMonthsAgo && itemDate <= today;
    });

    goldPrices.value = filteredData;
    exchangeRate.value = rate;
  } catch (e) {
    console.error('시세 로딩 실패:', e);
  }
});

// 변환 함수 (USD/toz → KRW/돈)
const toDonKRW = (usdToz: number): number =>
  usdToz * tozDon * exchangeRate.value;

// 최근 시세 비교용
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

// 차트 데이터 가공
const formattedDates = computed(
  () => goldPrices.value.map((item) => item.date) // 예: "25-07-28"
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

// 차트 시리즈
const series = computed(() => [
  {
    name: '금 시세',
    data: prices.value,
  },
]);

// 색상 동적 적용
const lineColor = computed(
  () =>
    priceDiff.value > 0
      ? 'oklch(0.568 0.2002 26.41)' // red-300
      : 'oklch(0.5134 0.1603 255.67)' // blue-300
);

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
        dataPointIndex === maxIndex.value ||
        dataPointIndex === minIndex.value ||
        dataPointIndex === lastIndex.value
      ) {
        const date = new Date(formattedDates.value[dataPointIndex]);
        return `${date.getMonth() + 1}/${date.getDate()}`;
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
    x: {
      formatter: (value: string | number) => {
        const date = new Date(value);
        const year = date.getFullYear().toString().slice(2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}/${month}/${day}`;
      },
    },
    y: {
      formatter: (val: number) => `${Math.round(val).toLocaleString()} 원`,
    },
  },
  xaxis: {
    categories: formattedDates.value,
    axisBorder: { show: true },
    axisTicks: { show: true },
    tooltip: { enabled: false },
    labels: {
      formatter: (value: string, timestamp: number, opts: any) => {
        if (typeof value !== 'string') return '';
        const date = new Date(value);
        const year = date.getFullYear().toString().slice(2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        if (
          opts.i === 0 ||
          new Date(formattedDates.value[opts.i - 1]).getMonth() !==
            date.getMonth()
        ) {
          return `${year}/${month}`;
        }
        return '';
      },
    },
  },
  yaxis: {
    show: true,
    labels: {
      formatter: (val: number) => Math.round(val).toLocaleString(),
    },
  },
  grid: {
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  },
}));
</script>
