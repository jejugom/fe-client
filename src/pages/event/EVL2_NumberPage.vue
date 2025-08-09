<template>
  <div class="mx-auto max-w-2xl p-6">
    <!-- Header -->
    <div class="mb-6 flex items-end justify-between gap-4">
      <div>
        <h1 class="text-primary-600 text-2xl font-bold">숫자 빨리 누르기</h1>
        <p class="text-surface-500 mt-1 text-base"
          >1부터 순서대로 눌러서 기록을 갱신해보세요!</p
        >
      </div>

      <!-- 난이도 -->
      <div class="flex items-center gap-2">
        <label class="text-surface-500 text-base">난이도</label>
        <select
          class="border-surface-200 focus:ring-primary-300 rounded-lg border bg-white px-3 py-2 text-base outline-none focus:ring-2"
          v-model.number="gridSize"
          :disabled="started"
          aria-label="난이도 선택"
        >
          <option :value="4">4×4</option>
          <option :value="5">5×5</option>
          <option :value="6">6×6</option>
        </select>
      </div>
    </div>

    <!-- Stats -->
    <div class="mb-4 grid grid-cols-3 gap-3">
      <div class="border-surface-200 rounded-lg border bg-white p-3">
        <div class="text-surface-500 text-xs">다음 숫자</div>
        <div class="text-xl font-semibold">{{ nextNumber }}</div>
      </div>
      <div class="border-surface-200 rounded-lg border bg-white p-3">
        <div class="text-surface-500 text-xs">경과 시간</div>
        <div class="text-xl font-semibold tabular-nums">{{ timeText }}</div>
      </div>
      <div class="border-surface-200 rounded-lg border bg-white p-3">
        <div class="text-surface-500 text-xs"
          >최고 기록 ({{ gridSize }}×{{ gridSize }})</div
        >
        <div class="text-xl font-semibold tabular-nums">
          {{ bestText ?? '-' }}
        </div>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="bg-surface-200 mb-4 h-2 w-full overflow-hidden rounded-full">
      <div
        class="bg-primary-400 h-full transition-[width]"
        :style="{ width: progress + '%' }"
      />
    </div>

    <!-- Controls -->
    <div class="mb-5 flex items-center gap-3">
      <button
        @click="startGame"
        class="bg-primary-500 hover:bg-primary-600 rounded-lg px-4 py-2 text-white shadow-sm active:translate-y-[1px] disabled:opacity-50"
        :disabled="started && !finished"
      >
        {{ finished ? '다시 시작' : started ? '진행 중…' : '시작하기' }}
      </button>

      <button
        @click="resetGame"
        class="border-surface-300 text-surface-700 hover:bg-surface-50 rounded-lg border bg-white px-4 py-2 active:translate-y-[1px]"
      >
        초기화
      </button>

      <span
        class="ml-auto text-base"
        :class="
          finished
            ? 'text-emerald-600'
            : wrongBlink
              ? 'text-rose-600'
              : 'text-surface-500'
        "
      >
        {{ statusText }}
      </span>
    </div>

    <!-- Grid -->
    <div
      class="grid gap-2"
      :style="{
        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
      }"
      role="grid"
      :aria-rowcount="gridSize"
      :aria-colcount="gridSize"
    >
      <button
        v-for="(n, idx) in numbers"
        :key="n + '-' + idx"
        role="gridcell"
        :aria-label="`${n}번 버튼`"
        @click="onCellClick(n, $event)"
        class="aspect-square rounded-lg border text-lg font-semibold shadow-sm transition select-none focus:ring-2 focus:outline-none"
        :class="cellClass(n)"
      >
        {{ n }}
      </button>
    </div>

    <!-- Tip -->
    <p class="text-surface-400 mt-5 text-center text-xs">
      팁: 시작을 누르고 바로 <span class="font-semibold">1</span>부터
      눌러보세요. 오답은 빨갛게 깜빡여요.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';

/** ---------- 상태 ---------- */
const gridSize = ref<number>(4); // 4,5,6
const numbers = ref<number[]>([]);
const nextNumber = ref<number>(1);
const started = ref<boolean>(false);
const finished = ref<boolean>(false);

// 타이머
const startTs = ref<number>(0);
const elapsedMs = ref<number>(0);
let rafId: number | null = null;

// 피드백
const wrongBlink = ref<boolean>(false);

/** ---------- 유틸 ---------- */
function shuffle<T>(arr: T[]): T[] {
  // Fisher–Yates
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fmt(ms: number): string {
  if (!ms || ms < 0) return '0.000';
  return (ms / 1000).toFixed(3);
}

const bestKey = computed(() => `evl2_best_${gridSize.value}`);
const bestMs = ref<number | null>(null);

function loadBest() {
  const raw = localStorage.getItem(bestKey.value);
  bestMs.value = raw ? Number(raw) : null;
}
function saveBest(ms: number) {
  if (bestMs.value === null || ms < bestMs.value) {
    bestMs.value = ms;
    localStorage.setItem(bestKey.value, String(ms));
  }
}

/** ---------- 타이머 ---------- */
function tick() {
  if (!started.value || finished.value) return;
  elapsedMs.value = performance.now() - startTs.value;
  rafId = requestAnimationFrame(tick);
}
function startTimer() {
  startTs.value = performance.now();
  elapsedMs.value = 0;
  stopTimer();
  rafId = requestAnimationFrame(tick);
}
function stopTimer() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

/** ---------- 게임 로직 ---------- */
function setupBoard() {
  const N = gridSize.value * gridSize.value;
  numbers.value = shuffle(Array.from({ length: N }, (_, i) => i + 1));
  nextNumber.value = 1;
  finished.value = false;
}

function startGame() {
  setupBoard();
  started.value = true;
  wrongBlink.value = false;
  startTimer();
}

function resetGame() {
  started.value = false;
  finished.value = false;
  wrongBlink.value = false;
  stopTimer();
  elapsedMs.value = 0;
  nextNumber.value = 1;
  setupBoard();
}

function onCellClick(n: number, e: MouseEvent) {
  if (!started.value || finished.value) return;

  if (n !== nextNumber.value) {
    // 오답 피드백
    wrongBlink.value = true;
    setTimeout(() => (wrongBlink.value = false), 150);
    (e.currentTarget as HTMLButtonElement)?.classList.add('shake');
    setTimeout(
      () => (e.currentTarget as HTMLButtonElement)?.classList.remove('shake'),
      200
    );
    return;
  }

  // 정답 → 버튼 비활성화 느낌을 주기 위해 0 표시
  const i = numbers.value.indexOf(n);
  if (i >= 0) numbers.value[i] = 0;

  nextNumber.value += 1;

  // 종료 체크
  const goal = gridSize.value * gridSize.value + 1;
  if (nextNumber.value === goal) {
    finished.value = true;
    stopTimer();
    saveBest(elapsedMs.value);
  }
}

/** ---------- 파생값 ---------- */
const timeText = computed(() => fmt(elapsedMs.value));
const bestText = computed(() =>
  bestMs.value == null ? null : fmt(bestMs.value)
);

const progress = computed(() => {
  const total = gridSize.value * gridSize.value;
  const done = nextNumber.value - 1;
  return Math.min(100, Math.round((done / total) * 100));
});

const statusText = computed(() => {
  if (finished.value) return `클리어! 기록 ${timeText.value}s`;
  if (wrongBlink.value) return '오답!';
  if (started.value) return '진행 중…';
  return '대기 중';
});

/** ---------- 셀 클래스 ---------- */
function cellClass(n: number) {
  if (n === 0)
    return 'border-surface-200 bg-surface-100 text-surface-300 pointer-events-none';
  // 다음 숫자 하이라이트
  if (n === nextNumber.value)
    return 'border-primary-300 bg-primary-50 text-primary-700 hover:bg-primary-100 focus:ring-primary-300';
  return 'border-surface-200 bg-white text-surface-700 hover:bg-surface-50 focus:ring-primary-300';
}

/** ---------- 워처 & 라이프사이클 ---------- */
watch(gridSize, () => {
  loadBest();
  resetGame();
});

onBeforeUnmount(() => stopTimer());

// 초기화
loadBest();
setupBoard();
</script>

<style scoped>
/* 간단한 진동 효과 */
@keyframes shake {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-2px);
  }
  50% {
    transform: translateX(2px);
  }
  75% {
    transform: translateX(-1px);
  }
  100% {
    transform: translateX(0);
  }
}
.shake {
  animation: shake 0.18s ease-in-out;
}
</style>
