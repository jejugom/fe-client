<template>
  <div class="border-primary-300 flex flex-col gap-2 rounded-xl border p-4">
    <div class="font-semibold">
      <div class="text-lg">
        <span class="text-gold">안정적인 주식형</span> 자산가<br />
        <span class="text-primary-300">{{ userName }}</span> 님의 자산 현황
      </div>
      <div>{{ assetAmount?.toLocaleString() }} 원</div>
    </div>
    <apexchart type="pie" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  userName: String,
  assetAmount: [String, Number],
  assetInfo: Object,
});

const series = computed(() => {
  if (!props.assetInfo) return [];
  return [
    props.assetInfo.real_estate,
    props.assetInfo.deposit,
    props.assetInfo.cash,
    props.assetInfo.stock_fund,
    props.assetInfo.business_equity,
    props.assetInfo.etc,
  ];
});

const chartOptions = computed(() => {
  const labels = ['부동산', '예적금', '현금', '주식/펀드', '사업지분', '기타'];
  const values = series.value;
  const sortedIndices = values
    .map((val, idx) => ({ val, idx }))
    .sort((a, b) => b.val - a.val)
    .slice(0, 3) // 상위 3개만
    .map((item) => item.idx);

  return {
    chart: {
      type: 'pie',
    },
    labels,
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: true,
      formatter: (val, { seriesIndex }) => {
        return sortedIndices.includes(seriesIndex)
          ? `${labels[seriesIndex]}: ${val.toFixed(1)}%`
          : '';
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val.toLocaleString()} 원`,
      },
    },
  };
});
</script>
