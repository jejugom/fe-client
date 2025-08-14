<template>
  <div
    class="relative left-1/2 mt-[-1.125rem] w-screen max-w-150 -translate-x-1/2"
  >
    <div class="bg-white px-4 py-8">
      <h2 class="text-primary-500 mb-4 text-center text-2xl font-bold"
        >증여세 시뮬레이션 결과</h2
      >
      <div class="mb-16">
        <div
          class="custom-shadow border-surface-200 bg-primary-100 relative overflow-hidden rounded-lg border px-4 py-8"
        >
          <div class="relative">
            <h3 class="text-primary-500 mb-2 text-xl font-semibold"
              >예상 증여세 총액</h3
            >
            <p class="text-primary-500 text-3xl font-bold">
              {{ formatCurrency(totalGiftTax) }}
            </p>
            <div class="text-primary-500 mt-4 mb-4 flex items-center">
              어떻게 계산되었는지 궁금하신가요? 🤔
            </div>
            <Btn
              color="surface"
              label="증여세 계산 방법 보러가기"
              size="large"
              @click="goToTaxInfo"
            />
          </div>
        </div>
      </div>

      <div class="mb-16">
        <!-- 수증자별 세금 요약표 -->
        <div
          class="custom-shadow border-surface-200 bg-primary-100 relative overflow-hidden rounded-lg border px-4 py-8"
        >
          <div class="mb-2 flex items-center">
            <h3 class="text-primary-500 text-xl font-semibold"
              >수증자별 세금 요약표</h3
            >
          </div>

          <div class="mb-8 overflow-hidden bg-white text-sm">
            <table class="w-full">
              <thead>
                <tr>
                  <th
                    class="bg-primary-500 border border-white px-2 py-4 text-center font-semibold text-white"
                  >
                    수증자
                  </th>
                  <th
                    class="bg-primary-500 border border-white px-2 py-4 text-center font-semibold text-white"
                  >
                    증여금
                  </th>
                  <th
                    class="bg-primary-500 border border-white px-2 py-4 text-center font-semibold text-white"
                  >
                    예상 증여세
                  </th>
                </tr>
              </thead>
              <tbody class="divide-surface-200 divide-y">
                <tr
                  v-for="(recipient, index) in recipientSummaries"
                  :key="index"
                >
                  <td>
                    <div class="text-center">
                      <div class="text-primary-500">
                        {{ recipient.recipientName }}
                      </div>
                    </div>
                  </td>
                  <td class="px-2 py-4 text-center">
                    <div class="text-primary-500 font-semibold">
                      {{ formatCurrency(recipient.totalGiftAmount) }}
                    </div>
                  </td>
                  <td class="px-2 py-4 text-center">
                    <div class="text-primary-500 font-semibold">
                      {{ formatCurrency(recipient.estimatedTax) }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 수증자별 증여금, 증여세 비교 차트 -->
          <div class="mb-2 flex items-center">
            <h3 class="text-primary-500 text-xl font-semibold"
              >수증자별 증여금, 증여세 비교</h3
            >
          </div>
          <div class="rounded-xl bg-white p-6">
            <div v-if="chartSeries.length > 0">
              <apexchart
                type="bar"
                :options="chartOptions"
                :series="chartSeries"
                height="300"
              ></apexchart>
            </div>
            <!-- 차트 데이터가 없을 때 처리 -->
            <div
              v-else
              class="text-primary-500 flex h-64 items-center justify-center"
            >
              <div class="text-center">
                <img
                  :src="ChartIcon"
                  alt="Chart Icon"
                  class="mx-auto h-12 w-12"
                />
                <p class="mt-2">차트 데이터를 불러오는 중...</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 유형별 절세 전략 추천 -->
      <div class="">
        <div
          class="custom-shadow border-surface-200 bg-primary-100 relative overflow-hidden rounded-lg border px-4 py-8"
        >
          <div class="mb-2 flex items-center text-center">
            <h3 class="text-primary-500 mb-4 text-xl font-semibold"
              >절세 전략 추천</h3
            >
          </div>

          <template
            v-for="(item, itemIndex) in displayStrategies"
            :key="itemIndex"
          >
            <h4
              v-if="item.isHeader"
              class="text-primary-300 mb-2 text-lg font-semibold"
            >
              {{ item.categoryName }}별
            </h4>
            <div v-else class="group mx-1 mb-4 flex items-start">
              <!-- 숫자 인덱스 -->
              <div
                class="text-primary-300 mt-2 mr-4 flex h-7 w-7 items-center justify-center text-3xl font-black"
              >
                {{ item.globalIndex }}
              </div>

              <!-- 전략 내용 -->
              <div class="flex-1">
                <p class="">
                  {{ item.strategy.content }}
                </p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import VueApexCharts from 'vue3-apexcharts';
import Btn from '@/components/buttons/Btn.vue';

import { formatCurrency } from '@/utils/format';
import { useSimulationStore } from '@/stores/simulation';
import type {
  RecipientTaxDetailDto,
  SimulationRequestDto,
  TaxSavingStrategy,
} from '@/types/gift/simulation';

import ChartIcon from '@/assets/icons/Charts.svg';

const apexchart = VueApexCharts;
const simulationStore = useSimulationStore();
const router = useRouter();

const goToTaxInfo = () => {
  router.push({ name: 'gift-taxinfo' });
};

const totalGiftTax = computed(() => simulationStore.totalGiftTax);
const recipientSummaries = computed(() => simulationStore.recipientSummaries);
const taxSavingStrategies = computed(() => simulationStore.taxSavingStrategies);

const displayStrategies = computed(() => {
  let globalIndex = 0;
  let lastCategory = '';
  type DisplayItem =
    | {
        isHeader: true;
        categoryName: string;
        strategy?: never;
        globalIndex?: never;
      }
    | {
        isHeader: false;
        categoryName?: never;
        strategy: TaxSavingStrategy;
        globalIndex: number;
      };

  const result: DisplayItem[] = [];

  taxSavingStrategies.value.forEach((strategy) => {
    if (strategy.ruleCategory !== lastCategory) {
      result.push({
        isHeader: true,
        categoryName: strategy.ruleCategory,
      });
      lastCategory = strategy.ruleCategory;
    }
    result.push({
      isHeader: false,
      strategy: strategy,
      globalIndex: ++globalIndex,
    });
  });
  return result;
});

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
