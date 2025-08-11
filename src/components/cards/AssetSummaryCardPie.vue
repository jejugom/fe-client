<template>
  <div class="card-design flex flex-col gap-2">
    <div v-if="hasData">
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
    <div v-else class="text-center">
      <p class="text-lg">아직 자산 정보가 없어요</p>
      <Btn
        color="primary"
        size="large"
        label="자산 등록하기"
        @click="router.push('edit-asset')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';
import Btn from '../buttons/Btn.vue';
import router from '@/router';

const props = defineProps<{
  userName: string;
  assetAmount: number;
  assetInfo: { category: string; amount: number }[];
}>();

const hasData = computed(
  () => props.assetInfo.length > 0 && props.assetAmount > 0
);
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

const formatCurrencyKorean = (amount: number) => {
  if (amount === 0) return '0원';

  const billion = Math.floor(amount / 100000000); // 억 단위
  const million = Math.floor(amount / 10000); // 만원 단위

  if (billion > 0) {
    return `${billion.toLocaleString()}억원`;
  } else if (million > 0) {
    return `${million.toLocaleString()}만원`;
  } else {
    return `${amount.toLocaleString()}원`;
  }
};

const chartOptions = computed(() => {
  const maxIndex = series.value.reduce(
    (maxIdx, val, idx, arr) => (val > arr[maxIdx] ? idx : maxIdx),
    0
  );

  return {
    chart: {
      type: 'donut',
      fontFamily: 'Pretendard-Regular, Noto Sans KR, sans-serif',
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
      y: {
        formatter: (val: number) => formatCurrencyKorean(val),
      },
    },
    dataLabels: {
      enabled: false,
      formatter: (val: number) => formatCurrencyKorean(val),
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            // 중앙의 "이름" (현재 포커스된 조각의 라벨)
            name: {
              show: true,
              formatter: (_: string, opts: any) => {
                const i = opts?.seriesIndex;
                return i != null ? labels.value[i] : '총자산';
              },
            },
            // 중앙의 "값" (현재 포커스된 조각의 값)
            value: {
              show: true,
              formatter: (val: number) => formatCurrencyKorean(val),
            },
            // 필요하면 중앙에 총합을 기본값으로 보여주기
            total: {
              show: true,
              label: '총자산',
              formatter: (w: any) => {
                const sum = w.globals.seriesTotals.reduce(
                  (a: number, b: number) => a + b,
                  0
                );
                return formatCurrencyKorean(sum);
              },
            },
          },
        },
      },
    },
  };
});
</script>
