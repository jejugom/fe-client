<template>
  <div class="border-primary-300 flex flex-col gap-2 rounded-xl border p-4">
    <div class="font-semibold">
      <div class="text-lg">
        <span class="text-gold">안정적인 주식형</span> 자산가<br />
        <span class="text-primary-300">{{ userName }}</span> 님의 자산 현황
      </div>
      <div>{{ assetAmount?.toLocaleString() }} 원</div>
    </div>
    <apexchart
      type="bar"
      height="100"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  userName: String,
  assetAmount: [String, Number],
  assetInfo: Object,
});

const assetLabels = [
  '부동산',
  '예적금',
  '현금',
  '주식/펀드',
  '사업지분',
  '기타',
];

const series = computed(() => {
  if (!props.assetInfo) return [];
  return assetLabels.map((label, index) => {
    const key = Object.keys(props.assetInfo)[index];
    return {
      name: label,
      data: [props.assetInfo[key]],
    };
  });
});

const chartOptions = computed(() => ({
  chart: {
    stacked: true,
    stackType: '100%',
    type: 'bar',
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '100%',
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => `${val.toFixed(0)}%`,
    offsetX: 0, // 라벨 위치 보정
    style: {
      fontSize: '12px',
    },
  },
  tooltip: {
    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      const labels = [
        '부동산',
        '예적금',
        '현금',
        '주식/펀드',
        '사업지분',
        '기타',
      ];
      const value = series[seriesIndex][dataPointIndex];
      const label = labels[seriesIndex];

      return `
      <div class="apex-tooltip-custom">
        <span style="font-weight:bold;">${label}</span><br/>
        ${value.toLocaleString()} 원
      </div>
    `;
    },
  },
  xaxis: {
    labels: {
      show: false,
      style: {
        fontSize: '0px',
      },
      padding: 0,
    },
  },
  yaxis: {
    labels: { show: false },
  },
  grid: {
    show: false,
  },
  colors: ['#cfe2ff', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6', '#34495e'],
  legend: {
    position: 'top',
    onItemClick: { toggleDataSeries: false },
    onItemHover: { highlightDataSeries: false },
  },
}));
</script>
