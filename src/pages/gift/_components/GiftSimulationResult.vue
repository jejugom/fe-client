<template>
  <div class="gift-simulation-result mb-4 w-full">
    <div class="mb-6">
      <h3 class="mb-2 text-lg font-bold">예상 증여세 총액은?</h3>
      <p class="text-xl font-semibold text-red-300">약 {{ totalGiftTax }}원</p>
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
          <tr v-for="(recipient, index) in recipients" :key="index">
            <td class="border-surface-200 border p-2">{{ recipient.name }}</td>
            <td class="border-surface-200 border p-2">
              {{ formatCurrency(recipient.giftAmount) }}원
            </td>
            <td class="border-surface-200 border p-2">
              {{ formatCurrency(recipient.estimatedTax) }}원
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const apexchart = VueApexCharts;

const totalGiftTax = ref('12,300,000');

const recipients = ref([
  { name: '김민수', giftAmount: 50000000, estimatedTax: 4500000 },
  { name: '이하은', giftAmount: 30000000, estimatedTax: 2700000 },
]);
const allStrategies = [
  '[전략 1] 증여 시기 분산 전략',
  '[전략 2] 수증자 분산 전략',
  '[전략 3] 자산 분할 증여 전략',
  '[전략 4] 미성년자 증여 제한 전략',
  '[전략 5] 증여자 세금 대납 방지 전략',
  '[전략 6] 세법 변경 리스크 회피 전략',
  '[전략 7] 배우자 공제 활용 전략',
  '[전략 8] 자산별 수증자 매칭 전략',
  '[전략 9] 전문가 상담 유도 전략',
];

const taxSavingStrategies = ref([
  allStrategies[1], // 전략 2
  allStrategies[4], // 전략 5
  allStrategies[8], // 전략 9
]);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('ko-KR').format(value);

// Chart series
const chartSeries = computed(() => [
  {
    name: '증여금',
    data: recipients.value.map((r) => r.giftAmount),
  },
  {
    name: '예상 증여세',
    data: recipients.value.map((r) => r.estimatedTax),
  },
]);

// Chart options
const chartOptions = computed(() => ({
  chart: { type: 'bar', height: 350, toolbar: { show: false } },
  plotOptions: {
    bar: { horizontal: false, columnWidth: '55%', endingShape: 'rounded' },
  },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 2, colors: ['transparent'] },
  xaxis: { categories: recipients.value.map((r) => r.name) },
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
}));
</script>
