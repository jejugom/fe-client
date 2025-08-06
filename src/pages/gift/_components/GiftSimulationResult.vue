<template>
  <div class="gift-simulation-result w-full p-4">
    <div class="mb-6">
      <h3 class="mb-2 text-lg font-bold">예상 증여세 총액은?</h3>
      <p class="text-xl font-semibold text-red-300">
        약 {{ formatCurrency(totalGiftTax) }} (수정)
      </p>
    </div>

    <div class="mb-6">
      <h3 class="mb-2 text-lg font-semibold">수증자별 세금 요약</h3>
      <table class="border-surface-200 w-full border text-sm">
        <thead class="bg-primary-100">
          <tr>
            <th class="border-surface-200 border p-2">수증자</th>
            <th class="border-surface-200 border p-2">증여금</th>
            <th class="border-surface-200 border p-2">예상 증여세 (수정)</th>
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
              {{ formatCurrency(recipient.estimatedTax) }}(수정)
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mb-6">
      <h3 class="mb-2 text-lg font-semibold">절세 전략 추천 (수정)</h3>
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
    <div class="mt-4 text-end">
      <p class="text-surface-300 italic">
        * 이 결과는 참고용 시뮬레이션이며, 실제 세액은 세무사 상담 후
        확정됩니다.
        <br />
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { useRouter } from 'vue-router';
import { formatCurrency } from '@/utils/format';

const apexchart = VueApexCharts;
const router = useRouter();

// 라우터 state 대신 window.history.state를 통해 데이터에 접근
interface RecipientSummary {
  name: string;
  giftAmount: number;
  estimatedTax: number;
}

const historyState = window.history.state;

const totalGiftTax = ref(historyState.totalGiftTax || 0);
const recipientSummaries = ref<RecipientSummary[]>(
  historyState.recipientSummaries || []
);

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
    data: recipientSummaries.value.map((r) => r.giftAmount),
  },
  {
    name: '예상 증여세',
    data: recipientSummaries.value.map((r) => r.estimatedTax),
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
    categories: recipientSummaries.value.map((r) => r.name),
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
}));
</script>
