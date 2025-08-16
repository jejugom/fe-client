<template>
  <div class="flex flex-col gap-8">
    <!-- Header -->
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="text-primary-500 mb-2 text-2xl font-bold"
          >숫자 빨리 누르기</h1
        >
        <p class="text-surface-300">
          1부터 순서대로 눌러서 기록을 갱신해보세요!
        </p>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex flex-col gap-2">
      <div class="flex gap-2">
        <Btn
          color="primary"
          size="large"
          :label="isRunning ? '일시정지' : started ? '계속하기' : '시작하기'"
          @click="toggleRun"
          :class="isRunning ? 'bg-red-100 text-red-500' : ''"
        />
        <Btn color="surface" size="large" label="초기화" @click="resetGame" />
      </div>
      <!-- Stats -->

      <div
        class="border-surface-200 flex items-center justify-around rounded-lg border bg-white p-2 text-center"
      >
        <div class="text-surface-500 text-base">경과 시간</div>
        <div class="text-primary-300 text-xl font-semibold tabular-nums">{{
          timeText
        }}</div>
      </div>

      <!-- 완료 Confirm -->
      <Confirm
        v-if="showConfirm"
        :title="confirmTitle"
        leftLabel="아니오"
        rightLabel="예"
        @click1="onConfirmYes"
        @click2="onConfirmNo"
      >
        <p class="text-center whitespace-pre-line">{{ confirmMessage }}</p>
      </Confirm>
    </div>

    <!-- 게임 -->
    <div
      class="mb-16 grid gap-2"
      :style="{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }"
    >
      <button
        v-for="(n, idx) in numbers"
        :key="n + '-' + idx"
        class="aspect-square rounded-lg border text-lg font-semibold shadow-sm select-none focus:outline-none"
        :class="cellClass(n)"
        @click="onCellClick(n)"
      >
        {{ n === 0 ? '' : n }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';
import Btn from '@/components/buttons/Btn.vue';
import Confirm from '@/components/modals/Confirm.vue';
import { useRewardStore } from '@/stores/reward';

/** -------- 상태(간소화) -------- */
const GRID = 3;
const COUNT = GRID * GRID;

const numbers = ref<number[]>([]);
const nextNumber = ref(1);

const started = ref(false); // 한 번이라도 시작했는지
const isRunning = ref(false); // 타이머/클릭 가능 여부
const finished = ref(false);

// 타이머
const startTs = ref(0);
const elapsedMs = ref(0);
let rafId: number | null = null;

// 최고 기록
const bestKey = 'evl2_best_3x3';
const bestMs = ref<number | null>(null);

// 보상 스토어
const rewardStore = useRewardStore();

// Router
const router = useRouter();

/** -------- 유틸 -------- */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function loadBest() {
  const raw = localStorage.getItem(bestKey);
  bestMs.value = raw ? Number(raw) : null;
}
function saveBest(ms: number) {
  if (bestMs.value === null || ms < bestMs.value) {
    bestMs.value = ms;
    localStorage.setItem(bestKey, String(ms));
  }
}
function fmt(ms: number) {
  if (!ms || ms < 0) return '0.000';
  return (ms / 1000).toFixed(3);
}

/** -------- 타이머 -------- */
function tick() {
  if (!isRunning.value || finished.value) return;
  elapsedMs.value = performance.now() - startTs.value;
  rafId = requestAnimationFrame(tick);
}
function startTimer() {
  startTs.value = performance.now() - elapsedMs.value; // 재개 시 이어서
  stopTimer();
  rafId = requestAnimationFrame(tick);
}
function stopTimer() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

/** -------- 게임 -------- */
function setupBoard() {
  numbers.value = shuffle(Array.from({ length: COUNT }, (_, i) => i + 1));
  nextNumber.value = 1;
  finished.value = false;
}
function toggleRun() {
  if (!isRunning.value) {
    // 시작 or 재개
    if (!started.value) {
      setupBoard();
      started.value = true;
      elapsedMs.value = 0;
    }
    isRunning.value = true;
    startTimer();
  } else {
    // 일시정지
    isRunning.value = false;
    stopTimer();
  }
}
function resetGame() {
  stopTimer();
  started.value = false;
  isRunning.value = false;
  finished.value = false;
  elapsedMs.value = 0;
  nextNumber.value = 1;
  setupBoard();
}
async function onFinish() {
  // 기록 저장 + 리워드 처리
  stopTimer();
  isRunning.value = false;
  finished.value = true;
  saveBest(elapsedMs.value);
  rewardStore.complete('number'); // ← 숫자 게임 완료 보상

  // 완료 Confirm
  const msg =
    `기록: ${fmt(elapsedMs.value)}초\n` +
    `최고 기록: ${bestMs.value == null ? '-' : fmt(bestMs.value)}초\n\n` +
    `생활편의 페이지로 돌아가겠습니까?`;
  const ok = await openConfirm(msg, '🎉 챌린지 완료');

  if (ok) {
    // 계속하기: 보드 리셋하고 대기 상태로
    resetGame();
  } else {
    // 이전 페이지로
    router.back();
  }
}

function onCellClick(n: number) {
  if (!isRunning.value || finished.value) return;
  if (n !== nextNumber.value) return; // 오답 처리 없이 깔끔하게 무시

  // 정답 → 0으로 바꿔서 비활성 느낌
  const i = numbers.value.indexOf(n);
  if (i >= 0) numbers.value[i] = 0;

  nextNumber.value += 1;

  if (nextNumber.value === COUNT + 1) {
    onFinish();
  }
}

/** -------- 파생값 -------- */
const timeText = computed(() => fmt(elapsedMs.value));
const bestText = computed(() =>
  bestMs.value == null ? null : fmt(bestMs.value)
);

/** -------- 셀 스타일(심플) -------- */
function cellClass(n: number) {
  if (n === 0)
    return 'border-surface-200 bg-surface-100 text-surface-300 pointer-events-none';
  if (n === nextNumber.value)
    return 'border-primary-300 bg-primary-50 text-primary-700';
  return 'border-surface-200 bg-white text-surface-700';
}

/** -------- Confirm 모달 핸들링 -------- */
const showConfirm = ref(false);
const confirmTitle = ref<string | undefined>(undefined);
const confirmMessage = ref('');
let confirmResolve: ((v: boolean) => void) | null = null;

function openConfirm(message: string, title?: string) {
  return new Promise<boolean>((resolve) => {
    confirmMessage.value = message;
    confirmTitle.value = title;
    showConfirm.value = true;
    confirmResolve = resolve;
  });
}
function onConfirmNo() {
  showConfirm.value = false;
  confirmResolve?.(false);
  confirmResolve = null;
}
function onConfirmYes() {
  showConfirm.value = false;
  confirmResolve?.(true);
  confirmResolve = null;
}

/** -------- 초기화 -------- */
loadBest();
setupBoard();
onBeforeUnmount(() => stopTimer());
</script>
