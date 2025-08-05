<template>
  <div class="border-primary-300 flex flex-col gap-4 rounded-xl border p-4">
    <div class="text-lg font-semibold">
      {{ userName }} 님은 전체 사용자 중 상위
      <span class="text-primary-300">{{ rankPercent }}</span
      >% 자산 보유자예요
    </div>

    <!-- 반원형 게이지 -->
    <div class="flex items-center justify-center">
      <apexchart
        type="radialBar"
        :options="radialChartOptions"
        :series="radialChartSeries"
        height="250"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ApexOptions } from 'apexcharts';

const props = defineProps({
  userName: String,
  assetAmount: Number,
  rankPercent: Number, // 예: 9.7
  investmentRatio: Number, // 예: 61 (퍼센트)
});

// 반원형 게이지
const radialChartSeries = computed(() => [100 - (props.rankPercent || 0)]); // 랭크가 높을수록(숫자가 작을수록) 게이지가 많이 차도록 100에서 뺌
const radialChartOptions = computed(() => ({
  chart: {
    height: 250,
    type: 'radialBar',
    offsetY: -20,
    sparkline: { enabled: true },
  },
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 90,
      hollow: { size: '60%' },
      track: {
        background: '#dedede',
        startAngle: -90,
        endAngle: 90,
      },
      dataLabels: {
        name: {
          show: false,
        },
        value: {
          show: true,
          fontSize: '24px',
          fontFamily: 'Pretendard',
          fontWeight: 700,
          color: '#d1a843',
          offsetY: -10,
          formatter: () => `상위 ${props.rankPercent}%`,
        },
      },
    },
  },
  grid: {
    padding: { top: -20, bottom: 10 },
  },
  fill: {
    colors: ['#1565c0'],
  },
  stroke: { lineCap: 'round' },
}));

// 투자자산 비율 도넛 차트
const donutChartSeries = computed(() => [
  props.investmentRatio || 0,
  100 - (props.investmentRatio || 0),
]);
const donutChartOptions = computed<ApexOptions>(() => ({
  labels: ['투자 자산', '투자 외'],
  colors: ['#3674b5', '#D1D5DB'],
  dataLabels: {
    enabled: false,
    formatter: (val: number) => `${val.toFixed(0)}%`,
  },
  legend: {
    position: 'right',
    offsetY: 0,
    height: 100,
    markers: {
      width: 12,
      height: 12,
      strokeWidth: 0,
      strokeColor: '#fff',
      radius: 12,
      offsetX: -5,
      offsetY: 0,
    },
    itemMargin: {
      horizontal: 5,
      vertical: 10,
    },
  },
  tooltip: {
    y: {
      formatter: (val: number) => `${val.toFixed(0)}%`,
    },
  },
}));
</script>

<style scoped>
.apexcharts-legend {
  justify-content: center;
}
</style>
