<template>
  <div class="mb-4 w-full">
    <div class="mb-6">
      <h3 class="mb-2 text-xl font-bold">예상 증여세 총액</h3>
      <p class="text-2xl font-semibold">약 {{ totalGiftTax }}원</p>
    </div>

    <div class="mb-6">
      <h3 class="mb-2 text-lg font-semibold">수증자별 세금 요약</h3>
      <table class="w-full border-collapse border border-gray-300 text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="border border-gray-300 p-2">수증자</th>
            <th class="border border-gray-300 p-2">증여금</th>
            <th class="border border-gray-300 p-2">예상 증여세</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(recipient, index) in recipients" :key="index">
            <td class="border border-gray-300 p-2">{{ recipient.name }}</td>
            <td class="border border-gray-300 p-2">
              {{ formatCurrency(recipient.giftAmount) }}원
            </td>
            <td class="border border-gray-300 p-2">
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
      <p class="mb-2">수증자별 증여금 vs 증여세 비교 막대그래프</p>
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
import { ref, computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

// Register the component globally or locally if not already done
const apexchart = VueApexCharts;

const totalGiftTax = ref('12,300,000');

const recipients = ref([
  { name: '김민수', giftAmount: 50000000, estimatedTax: 4500000 },
  { name: '이하은', giftAmount: 30000000, estimatedTax: 2700000 },
]);

const taxSavingStrategies = ref([
  '10년 주기로 나눠 증여하면 공제 혜택 극대화',
  '자녀 2명에게 분산 증여하면 세율 낮출 수 있음',
  '금융자산보단 부동산 위주로 이전 시 공제 가능',
]);

// Helper to format currency for display
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ko-KR').format(value);
};

// --- ApexCharts Configuration ---

// Chart series data
const chartSeries = computed(() => {
  return [
    {
      name: '증여금',
      data: recipients.value.map((r) => r.giftAmount),
    },
    {
      name: '예상 증여세',
      data: recipients.value.map((r) => r.estimatedTax),
    },
  ];
});

// Chart options
const chartOptions = computed(() => {
  return {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    yaxis: {
      labels: {
        formatter: function (value: number) {
          if (value >= 100000000) {
            return (value / 100000000).toFixed(0) + '억 원';
          }
          if (value >= 10000) {
            return (value / 10000).toFixed(0) + '만 원';
          }
          return formatCurrency(value);
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return formatCurrency(val) + '원';
        },
      },
    },
    colors: ['#93C5FD', '#2563EB'],
  };
});
</script>
