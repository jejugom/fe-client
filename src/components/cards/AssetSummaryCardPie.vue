<template>
  <div class="border-primary-300 flex flex-col gap-2 rounded-lg border p-4">
    <div class="font-semibold">
      <div class="text-lg">
        {{ userName }}님은
        <span class="text-primary-300 font-semibold">
          {{ maxAsset.label }}
        </span>
        이(가)
        <span class="text-primary-300 font-semibold">
          {{ maxAsset.ratio }}%
        </span>
        로 가장 많아요
      </div>
    </div>
    <apexchart
      type="donut"
      height="300"
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

const labels = computed(() => props.assetInfo.map((item) => item.category));
const series = computed(() => props.assetInfo.map((item) => item.amount));

// 가장 비율 높은 항목 구하기
const maxAsset = computed(() => {
  const values = series.value;
  const total = props.assetAmount || 0;
  if (values.length === 0 || total === 0) return { label: '', ratio: '0.0' };

  const maxIndex = values.reduce(
    (maxIdx, val, idx, arr) => (val > arr[maxIdx] ? idx : maxIdx),
    0
  );
  const label = labels.value[maxIndex];
  const ratio = ((values[maxIndex] / total) * 100).toFixed(1);

  return { label, ratio };
});

const chartOptions = computed(() => {
  const maxIndex = series.value.reduce(
    (maxIdx, val, idx, arr) => (val > arr[maxIdx] ? idx : maxIdx),
    0
  );

  return {
    chart: {
      type: 'donut',
    },
    labels: labels.value,
    colors: labels.value.map((_, idx) =>
      idx === maxIndex ? '#3674b5' : '#dedede'
    ),
    legend: {
      position: 'right',
      fontSize: '12px',
      formatter: (seriesName: string, opts: any) => {
        const val = opts.w.globals.series[opts.seriesIndex];
        const total = opts.w.globals.series.reduce(
          (a: number, b: number) => a + b,
          0
        );
        const ratio = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
        return `${seriesName}: ${ratio}%`;
      },
    },
    tooltip: {
      show: false,
    },
    dataLabels: {
      enabled: false,
      formatter: (val: number, { seriesIndex }: any) => {
        return seriesIndex === maxIndex
          ? `${labels.value[seriesIndex]}: ${val.toFixed(1)}%`
          : '';
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: '총 자산',
              formatter: () => `${props.assetAmount.toLocaleString()} 원`,
            },
          },
        },
      },
    },
  };
});
</script>
