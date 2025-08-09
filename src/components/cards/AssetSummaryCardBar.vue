<template>
  <div class="stroke-primary flex flex-col gap-2 rounded-lg bg-white p-4">
    <div class="font-semibold">
      <div class="text-lg"> 지금까지 모은 자산은 이렇게 구성돼 있어요 </div>
      <div>총 {{ assetAmount?.toLocaleString() }} 원</div>
    </div>
    <apexchart
      type="bar"
      height="100"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = defineProps<{
  userName: string;
  assetAmount: number;
  assetInfo: { category: string; amount: number }[];
}>();

const series = computed(() => {
  return props.assetInfo.map((item) => ({
    name: item.category,
    data: [item.amount],
  }));
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
    formatter: (val: number) => `${val.toFixed(0)}%`,
    offsetX: 0,
    style: {
      fontSize: '10px',
    },
  },
  tooltip: {
    x: {
      show: false,
    },
    y: {
      // toLocaleString()으로 이미 포맷팅하고 있습니다.
      formatter: (val: number) => `${val.toLocaleString()} 원`,
    },
  },
  xaxis: {
    min: 0,
    max: 100,
    labels: {
      show: false,
    },
    axisTicks: { show: false },
    axisBorder: { show: false },
  },
  yaxis: {
    show: false,
  },
  grid: {
    show: false,
    padding: {
      left: 0,
      right: 20,
    },
  },
  colors: ['#5B9BD5', '#70AD47', '#ED7D31', '#7030A0', '#7F7F7F', '#264478'],
  legend: {
    position: 'top',
    horizontalAlign: 'center',
    fontSize: '10px',
    itemMargin: {
      horizontal: 6,
    },
  },
}));
</script>
