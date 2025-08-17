<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-col items-end justify-end gap-2">
      <div class="text-surface-300 text-sm"> (기준: 3개월)</div>
      <!-- 토글 버튼 -->
      <div
        class="border-surface-200 inline-flex w-max items-center overflow-hidden rounded-xl border"
      >
        <button
          class="px-4 py-2 text-sm"
          :class="
            mode === 'daily'
              ? 'bg-primary-100 text-primary-500 font-semibold'
              : 'text-surface-500'
          "
          @click="mode = 'daily'"
        >
          <span class="text-primary-300">●</span> 일일수익률
        </button>
        <button
          class="px-4 py-2 text-sm"
          :class="
            mode === 'cumulative'
              ? 'bg-primary-100 text-primary-500 font-semibold'
              : 'text-surface-500'
          "
          @click="mode = 'cumulative'"
        >
          <span class="text-secondary-300">●</span> 누적수익률
        </button>
      </div>
    </div>

    <!-- 차트 -->
    <apexchart type="line" height="320" :series="series" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

type TooltipCtx = {
  series: number[][];
  seriesIndex: number;
  dataPointIndex: number;
  w: any;
};

type Point = { recordDate: string; returnRate: number };
const props = defineProps<{ fundReturn: Point[] }>();

// 과거 → 현재 정렬
const sorted = computed(() =>
  [...props.fundReturn].sort(
    (a, b) =>
      new Date(a.recordDate).getTime() - new Date(b.recordDate).getTime()
  )
);

// 날짜 → ms
const toX = (d: string) => new Date(d).getTime();

// 일일 절댓값 평균이 1.5 이상이면 퍼센트
const isPercent = computed(() => {
  const vals = sorted.value
    .map((d) => Math.abs(Number(d.returnRate)))
    .filter((n) => Number.isFinite(n));
  if (!vals.length) return true; // 디폴트: 퍼센트로 취급
  const avgAbs = vals.reduce((a, b) => a + b, 0) / vals.length;
  return avgAbs > 1.5;
});

// 일일(%) 시리즈 (보여줄 때는 항상 %)
const dailySeries = computed<[number, number][]>(() =>
  sorted.value.map((d) => {
    const pct = isPercent.value
      ? Number(d.returnRate)
      : Number(d.returnRate) * 100;
    return [toX(d.recordDate), Number(pct)];
  })
);

// 누적 = exp(Σ ln(1+r)) - 1, r는 '소수' 단위여야 함
const cumulativeSeries = computed<[number, number][]>(() => {
  let logSum = 0; // Σ ln(1+r)
  return sorted.value.map((d) => {
    const rDecimal = isPercent.value
      ? Number(d.returnRate) / 100
      : Number(d.returnRate);
    logSum += Math.log1p(rDecimal); // ln(1+r)
    const cumPct = Math.expm1(logSum) * 100; // exp(Σ) - 1 → %
    return [toX(d.recordDate), Number(cumPct.toFixed(2))];
  });
});

// y축 범위 계산
const yDaily = computed(() => {
  const vals = dailySeries.value.map(([, v]) => v);
  if (!vals.length) return { min: -3, max: 3 };
  const pad = 0.5;
  const minV = Math.min(...vals),
    maxV = Math.max(...vals);
  return {
    min: Math.floor((minV - pad) * 2) / 2,
    max: Math.ceil((maxV + pad) * 2) / 2,
  };
});

const yCum = computed(() => {
  const vals = cumulativeSeries.value.map(([, v]) => v);
  if (!vals.length) return { min: -5, max: 5 };
  const pad = 1;
  const minV = Math.min(...vals),
    maxV = Math.max(...vals);
  return {
    min: Math.floor((Math.min(minV, 0) - pad) * 1) / 1,
    max: Math.ceil((Math.max(maxV, 0) + pad) * 1) / 1,
  };
});

// 뷰 모드 토글
const mode = ref<'daily' | 'cumulative'>('daily');

const palette = {
  dailyStrong: '#3674b5', // 파랑
  dailySoft: '#3674b550',
  cumStrong: '#ffbc00', // 노랑
  cumSoft: '#ffbc0050',
  grey: '#c5c5c5',
};

// 시리즈(강조/비강조 + yAxisIndex 지정)
const series = computed(() => {
  const isDaily = mode.value === 'daily';
  return [
    {
      name: '일일 수익률',
      type: 'column',
      data: dailySeries.value,
      yAxisIndex: 0,
      color: isDaily ? palette.dailyStrong : palette.dailySoft,
    },
    {
      name: '누적 수익률',
      type: 'line',
      data: cumulativeSeries.value,
      yAxisIndex: 1,
      color: isDaily ? palette.cumSoft : palette.cumStrong,
    },
  ];
});

// 차트 옵션
const options = computed<any>(() => {
  const isDaily = mode.value === 'daily';
  const strokeWidths = isDaily ? [0, 2] : [0, 3.5]; // 누적 모드에서 라인 더 두껍게
  const tickAmount = 6;

  // const fmt = (v: number | string) => {
  //   const date = new Date(Number(v));
  //   const yy = String(date.getFullYear()).slice(2);
  //   const mm = String(date.getMonth() + 1).padStart(2, '0');
  //   const dd = String(date.getDate()).padStart(2, '0');
  //   return `${yy}.${mm}.${dd}`;
  // };

  const fmtMonthly = (v: number | string) => {
    const date = new Date(Number(v));
    const yy = String(date.getFullYear()).slice(2);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    return `${yy}.${mm}`;
  };

  return {
    chart: {
      type: 'line',
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { speed: 250 },
    },
    theme: { mode: 'light' },
    stroke: { width: strokeWidths, curve: 'straight', lineCap: 'round' },
    dataLabels: { enabled: false },
    markers: { size: 0, hover: { size: 5 } },
    xaxis: {
      type: 'datetime',
      tickAmount: Math.max(3, Math.min(3, dailySeries.value.length)),
      labels: {
        datetimeUTC: false,
        formatter: fmtMonthly,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: [
      {
        title: {
          text: '일일(%)',
          style: { color: isDaily ? palette.dailyStrong : palette.grey },
        },
        min: yDaily.value.min,
        max: yDaily.value.max,
        tickAmount,
        labels: { formatter: (v: number) => `${v.toFixed(1)}%` },
      },
      {
        opposite: true,
        title: {
          text: '누적(%)',
          style: { color: !isDaily ? palette.cumStrong : palette.grey },
        },
        min: yCum.value.min,
        max: yCum.value.max,
        tickAmount,
        labels: { formatter: (v: number) => `${v.toFixed(1)}%` },
      },
    ],
    grid: {
      strokeDashArray: 4,
      borderColor: '#e9eef5',
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    legend: {
      show: false,
      position: 'top',
      horizontalAlign: 'right',
      onItemClick: { toggleDataSeries: false },
      onItemHover: { highlightDataSeries: false },
    },
    tooltip: {
      shared: true,
      custom: function ({
        series,
        seriesIndex,
        dataPointIndex,
        w,
      }: TooltipCtx) {
        const date = new Date(w.globals.seriesX[seriesIndex][dataPointIndex]);
        const yy = String(date.getFullYear()).slice(2);
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');

        const dailyVal = series[0][dataPointIndex]?.toFixed(2) ?? '0.00';
        const cumVal = series[1][dataPointIndex]?.toFixed(2) ?? '0.00';

        return `
      <div style="padding:8px 12px; border-radius:8px; background:rgba(255,255,255,0.9); box-shadow:0 2px 6px rgba(0,0,0,0.15); font-size:12px">
        <div style="font-weight:bold; color:#555; margin-bottom:4px;">${yy}.${mm}.${dd}</div>
        <div style="color:#3674b5;">● 일일 수익률: ${dailyVal}%</div>
        <div style="color:#ffbc00;">● 누적 수익률: ${cumVal}%</div>
      </div>
    `;
      },
    },
    annotations: {
      yaxis: [
        {
          y: 0,
          yAxisIndex: 0,
          borderColor: '#c5ced7',
          strokeDashArray: 4,
          label: {
            text: '0%',
            style: { background: 'transparent', color: '#8a95a6' },
            borderWidth: 0,
          },
        },
        {
          y: 0,
          yAxisIndex: 1,
          borderColor: '#c5ced7',
          strokeDashArray: 4,
          label: {
            text: '0%',
            style: { background: 'transparent', color: '#8a95a6' },
            borderWidth: 0,
          },
        },
      ],
    },
    plotOptions: {
      bar: { columnWidth: '68%', borderRadius: 3 },
    },
  };
});
</script>
