<template>
  <div v-if="hasData" class="card-design flex flex-col gap-2">
    <div class="font-semibold">
      <div class="text-lg">지금까지 모은 자산은 이렇게 구성돼 있어요</div>
      <div>총 {{ displayTotal.toLocaleString() }} 원</div>
    </div>

    <apexchart
      type="bar"
      height="120"
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
      @click="router.push({ name: 'edit-asset' })"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';
import Btn from '../buttons/Btn.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

type AssetItem = { category: string; amount: number };

const props = defineProps<{
  userName: string;
  assetAmount: number; // 총액(선택), 없으면 assetInfo 합으로 계산
  assetInfo: AssetItem[];
}>();

const hasData = computed(
  () => props.assetInfo.length > 0 && props.assetAmount > 0
);

// 총합 (prop.assetAmount가 신뢰 가능한 값이면 그걸 우선 사용)
const calcTotal = computed(() => {
  const s = props.assetInfo?.reduce(
    (acc, cur) => acc + (Number(cur.amount) || 0),
    0
  );
  return Number.isFinite(props.assetAmount) && props.assetAmount > 0
    ? props.assetAmount
    : s || 0;
});

const displayTotal = computed(() => calcTotal.value);

// ApexCharts가 요구하는 series 형태 (series별 data는 하나의 바에 쌓임)
const series = computed(() =>
  (props.assetInfo ?? [])
    .filter((i) => Number(i.amount) > 0)
    .map((i) => ({
      name: i.category,
      data: [Number(i.amount)],
    }))
);

// 색상 (최대 6개 예시)
const colors = [
  '#4CAF50',
  '#9E9E9E',
  '#2196F3',
  '#FF9800',
  '#795548',
  '#9C27B0',
];

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    fontFamily: 'Pretendard-Regular, Noto Sans KR, sans-serif',
    stacked: true,
    stackType: '100%', // 백분율 스택
    toolbar: { show: false },
    animations: { enabled: true },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '100%',
    },
  },
  // 데이터 라벨은 %로 표기 (0%는 숨김)
  dataLabels: {
    enabled: true,
    formatter: (_val: number, opts: any) => {
      // 100% 스택에서 퍼센트 직접 계산
      const w = opts.w;
      const sIdx = opts.seriesIndex;
      const dIdx = opts.dataPointIndex; // 단일 바 → 보통 0
      const stackedTotals: number[] = w?.globals?.stackedSeriesTotals ?? [];
      const total = stackedTotals[dIdx] || 0;
      const value = w?.config?.series?.[sIdx]?.data?.[dIdx] ?? 0;
      const pct = total ? (value / total) * 100 : 0;
      return pct < 3 ? '' : `${pct.toFixed(0)}%`; // 3% 미만은 숨김
    },
    style: {
      fontSize: '10px',
    },
    offsetX: 0,
  },
  tooltip: {
    x: { show: false },
    y: {
      formatter: (val: number) => `${Number(val || 0).toLocaleString()} 원`,
      title: { formatter: (seriesName: string) => seriesName },
    },
  },
  xaxis: {
    min: 0,
    max: 100,
    labels: { show: false },
    axisTicks: { show: false },
    axisBorder: { show: false },
  },
  yaxis: { show: false },
  grid: {
    show: false,
    padding: { left: 0, right: 20 },
  },
  colors,
  legend: {
    position: 'top',
    horizontalAlign: 'center',
    fontSize: '10px',
    itemMargin: { horizontal: 6, vertical: 4 },
  },
  noData: { text: '자산 데이터가 없습니다.' },
}));
</script>

<style scoped>
/* Legend를 3개씩 줄바꿈 되도록 강제 */
:deep(.apexcharts-legend) {
  display: flex !important;
  flex-wrap: wrap !important;
  justify-content: center;
}
:deep(.apexcharts-legend .apexcharts-legend-series) {
  flex: 0 0 calc(100% / 4);
  max-width: calc(100% / 4);
  text-align: center;
}
</style>
