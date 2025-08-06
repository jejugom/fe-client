<template>
  <div class="gift-simulation-result mb-4 w-full">
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
              {{ recipient.recipientName }}
            </td>
            <td class="border-surface-200 border p-2">
              {{ formatCurrency(recipient.totalGiftAmount) }}
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
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

import { formatCurrency } from '@/utils/format';
import { useSimulationStore } from '@/stores/simulation';
import type {
  RecipientTaxDetailDto,
  SimulationRequestDto,
} from '@/types/gift/simulation';

const apexchart = VueApexCharts;
const simulationStore = useSimulationStore();

const totalGiftTax = computed(() => simulationStore.totalGiftTax);
const recipientSummaries = computed(() => simulationStore.recipientSummaries);
const taxSavingStrategies = computed(() => simulationStore.taxSavingStrategies);

// 차트 데이터 로직을 수정합니다.
const chartSeries = computed(() => {
  // recipientSummaries.value가 존재하고 데이터가 있을 때만 map()을 실행
  if (!recipientSummaries.value || recipientSummaries.value.length === 0) {
    return [];
  }
  return [
    {
      name: '증여금',
      data: recipientSummaries.value.map(
        (r: RecipientTaxDetailDto) => r.totalGiftAmount
      ),
    },
    {
      name: '예상 증여세',
      data: recipientSummaries.value.map(
        (r: RecipientTaxDetailDto) => r.estimatedTax
      ),
    },
  ];
});

const chartOptions = computed(() => {
  // recipientSummaries.value가 존재하고 데이터가 있을 때만 map()을 실행
  if (!recipientSummaries.value || recipientSummaries.value.length === 0) {
    return {}; // 빈 객체를 반환하여 에러 방지
  }
  return {
    chart: { type: 'bar', height: 350, toolbar: { show: false } },
    plotOptions: {
      bar: { horizontal: false, columnWidth: '55%', endingShape: 'rounded' },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: {
      categories: recipientSummaries.value.map(
        (r: RecipientTaxDetailDto) => r.recipientName
      ),
    },
    yaxis: {
      labels: {
        formatter(value: number) {
          if (value >= 100000000) {
            return `${(value / 100000000).toFixed(0)}억 원`;
          }
          if (value >= 10000) {
            return `${(value / 10000).toFixed(0)}만 원`;
          }
          return formatCurrency(value);
        },
      },
    },
    fill: { opacity: 1 },
    tooltip: {
      y: {
        formatter(val: number) {
          return `${formatCurrency(val)}`;
        },
      },
    },
    colors: ['#93C5FD', '#2563EB'],
  };
});
</script>
