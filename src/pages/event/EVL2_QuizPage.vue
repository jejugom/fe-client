<template>
  <div class="mx-auto max-w-3xl p-6">
    <!-- Header -->
    <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="text-primary-600 text-2xl font-bold">금융지식 퀴즈</h1>
        <p class="text-surface-500 mt-1 text-base">
          객관식 문제를 풀고 금융 상식을 레벨업하세요!
        </p>
      </div>

      <!-- 옵션 -->
      <div class="flex items-center gap-3">
        <select
          class="border-surface-300 focus:ring-primary-300 rounded-lg border bg-white px-3 py-2 text-base focus:ring-2"
          v-model="selectedCategory"
          :disabled="started"
          aria-label="카테고리 선택"
        >
          <option value="all">전체</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>

        <select
          class="border-surface-300 focus:ring-primary-300 rounded-lg border bg-white px-3 py-2 text-base focus:ring-2"
          v-model="selectedDifficulty"
          :disabled="started"
          aria-label="난이도 선택"
        >
          <option value="all">난이도 전체</option>
          <option value="easy">기초</option>
          <option value="normal">보통</option>
          <option value="hard">심화</option>
        </select>
      </div>
    </div>

    <!-- Top stats -->
    <div class="mb-4 grid grid-cols-3 gap-3">
      <div class="border-surface-200 rounded-lg border bg-white p-3">
        <div class="text-surface-500 text-xs">문항 수</div>
        <div class="text-xl font-semibold">{{ quizCount }}문항</div>
      </div>
      <div class="border-surface-200 rounded-lg border bg-white p-3">
        <div class="text-surface-500 text-xs">진행도</div>
        <div class="text-xl font-semibold tabular-nums">
          {{ currentIndex + 1 }}/{{ quizCount }}
        </div>
      </div>
      <div class="border-surface-200 rounded-lg border bg-white p-3">
        <div class="text-surface-500 text-xs">최고 점수</div>
        <div class="text-xl font-semibold tabular-nums">
          {{ bestScore ?? '-' }}점
        </div>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="bg-surface-200 mb-6 h-2 w-full overflow-hidden rounded-full">
      <div
        class="bg-primary-400 h-full transition-[width]"
        :style="{ width: progress + '%' }"
      />
    </div>

    <!-- Controls -->
    <div class="mb-5 flex items-center gap-3">
      <button
        class="bg-primary-500 hover:bg-primary-600 rounded-lg px-4 py-2 text-white shadow-sm active:translate-y-[1px] disabled:opacity-50"
        @click="startQuiz"
        :disabled="started && !finished"
      >
        {{ finished ? '다시 풀기' : started ? '진행 중…' : '시작하기' }}
      </button>

      <button
        class="border-surface-300 text-surface-700 hover:bg-surface-50 rounded-lg border bg-white px-4 py-2 active:translate-y-[1px]"
        @click="reset"
      >
        초기화
      </button>

      <label class="ml-auto flex items-center gap-2 text-base select-none">
        <input
          type="checkbox"
          class="size-4"
          v-model="useTimer"
          :disabled="started"
        />
        제한시간(문항당 20초)
      </label>
    </div>

    <!-- Question Card -->
    <div
      v-if="started && !finished"
      class="border-surface-200 rounded-lg border bg-white p-6 shadow-sm"
    >
      <div class="mb-4 flex items-center justify-between gap-3">
        <div class="text-base">
          <span
            class="bg-surface-100 text-surface-700 rounded-lg px-2 py-1 font-medium"
            >{{ currentQuestion.category }}</span
          >
          <span
            class="ml-2 rounded-lg px-2 py-1 text-xs"
            :class="difficultyBadgeClass(currentQuestion.difficulty)"
          >
            {{ difficultyLabel(currentQuestion.difficulty) }}
          </span>
        </div>

        <!-- Per-question timer -->
        <div v-if="useTimer" class="flex items-center gap-2">
          <div class="bg-surface-200 h-2 w-40 overflow-hidden rounded-full">
            <div
              class="h-full bg-rose-500 transition-[width] duration-100"
              :style="{ width: timeLeftPct + '%' }"
            />
          </div>
          <span class="text-surface-600 text-base tabular-nums"
            >{{ timeLeft }}s</span
          >
        </div>
      </div>

      <h2 class="mb-6 text-lg leading-relaxed font-semibold">
        Q{{ currentIndex + 1 }}. {{ currentQuestion.question }}
      </h2>

      <div class="grid gap-3 sm:grid-cols-2">
        <button
          v-for="(choice, i) in currentQuestion.choices"
          :key="i"
          @click="choose(i)"
          class="rounded-lg border p-3 text-left transition focus:ring-2 focus:outline-none"
          :class="choiceClass(i)"
          :disabled="answered"
        >
          <span class="mr-2 font-semibold">{{ 'ABCD'[i] }}.</span>
          <span>{{ choice }}</span>
        </button>
      </div>

      <!-- feedback -->
      <div class="mt-4 min-h-6 text-base">
        <p
          v-if="answered"
          :class="isCorrect ? 'text-emerald-600' : 'text-rose-600'"
        >
          {{ isCorrect ? '정답!' : '오답!' }}
          <span v-if="!isCorrect" class="text-surface-600 ml-2"
            >정답은 "{{
              currentQuestion.choices[currentQuestion.answer]
            }}"</span
          >
        </p>
      </div>

      <div class="mt-6 flex justify-end gap-2">
        <button
          class="border-surface-300 text-surface-700 hover:bg-surface-50 rounded-lg border bg-white px-4 py-2"
          @click="skip"
          :disabled="answered"
        >
          건너뛰기
        </button>
        <button
          class="bg-primary-500 hover:bg-primary-600 rounded-lg px-4 py-2 text-white disabled:opacity-50"
          @click="next"
          :disabled="!answered"
        >
          다음 ▶
        </button>
      </div>
    </div>

    <!-- Result -->
    <div
      v-if="finished"
      class="border-surface-200 rounded-lg border bg-white p-6 text-center shadow-sm"
    >
      <h3 class="mb-2 text-xl font-bold">결과</h3>
      <p class="text-surface-600">
        점수 <span class="text-primary-600 font-semibold">{{ score }}</span> /
        {{ quizCount }}점
        <span
          v-if="bestUpdated"
          class="ml-2 rounded bg-amber-100 px-2 py-0.5 text-amber-800"
          >최고기록 갱신!</span
        >
      </p>

      <div class="mx-auto mt-5 grid max-w-md grid-cols-2 gap-3 text-base">
        <div class="bg-surface-50 rounded-lg border p-3">
          정답: <b class="text-emerald-600">{{ correctCount }}</b>
        </div>
        <div class="bg-surface-50 rounded-lg border p-3">
          오답/스킵: <b class="text-rose-600">{{ wrongCount }}</b>
        </div>
      </div>

      <button
        class="bg-primary-500 hover:bg-primary-600 mt-6 rounded-lg px-4 py-2 text-white"
        @click="startQuiz"
      >
        다시 풀기
      </button>
    </div>

    <!-- Empty state -->
    <div
      v-if="!started && !finished"
      class="text-surface-500 rounded-lg border border-dashed p-10 text-center"
    >
      옵션을 고르고 <b>시작하기</b>를 눌러 주세요.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';

/** ---------- 데이터 샘플 (원하면 API로 대체 가능) ---------- */
type Difficulty = 'easy' | 'normal' | 'hard';
type Quiz = {
  id: string;
  category: string;
  difficulty: Difficulty;
  question: string;
  choices: string[];
  answer: number; // index
  explain?: string;
};

const QUIZ_BANK: Quiz[] = [
  {
    id: 'q1',
    category: '예금/적금',
    difficulty: 'easy',
    question: '예금 금리 표기에서 연 4.0%(세전) 이 의미하는 것은?',
    choices: [
      '1년 만기 시 이자 4.0%를 받는다',
      '매달 4.0% 이자를 받는다',
      '세후 4.0% 이자를 받는다',
      '복리 4.0%로 매일 지급된다',
    ],
    answer: 0,
  },
  {
    id: 'q2',
    category: '대출',
    difficulty: 'normal',
    question: '주택담보대출 LTV가 60%라면 맞는 설명은?',
    choices: [
      '소득의 60%까지 빌릴 수 있다',
      '주택 가격의 60%까지 빌릴 수 있다',
      '이자율이 6.0%로 제한된다',
      'DTI가 60%라는 뜻이다',
    ],
    answer: 1,
  },
  {
    id: 'q3',
    category: '펀드',
    difficulty: 'normal',
    question: '인덱스 펀드의 주요 특징으로 가장 적절한 것은?',
    choices: [
      '펀드매니저가 시장을 초과수익 내도록 적극 운용',
      '특정 지수의 수익률을 추종하도록 설계',
      '원금 보장이 항상 된다',
      '수수료가 액티브 펀드보다 높은 편',
    ],
    answer: 1,
  },
  {
    id: 'q4',
    category: '세금',
    difficulty: 'hard',
    question: '금융소득종합과세 대상 기준(현행)에 가장 가까운 설명은?',
    choices: [
      '모든 금융소득은 무조건 종합과세',
      '이자·배당 등 금융소득 연 2,000만원 초과 시 종합과세',
      '이자·배당 등 금융소득 연 200만원 초과 시 종합과세',
      '근로소득이 있으면 무조건 종합과세',
    ],
    answer: 1,
  },
  {
    id: 'q5',
    category: '보장성',
    difficulty: 'easy',
    question: '실손의료보험에 대한 설명으로 가장 적절한 것은?',
    choices: [
      '입원비만 보장한다',
      '비급여는 전혀 보장하지 않는다',
      '실제 부담한 의료비 일부를 보장한다',
      '평생 보험료가 고정이다',
    ],
    answer: 2,
  },
  {
    id: 'q6',
    category: '예금/적금',
    difficulty: 'normal',
    question: '적금의 실질 수익률이 예금보다 낮게 느껴지는 이유는?',
    choices: [
      '금리 자체가 낮아서',
      '매달 납입해 평균 보유기간이 짧아서',
      '세금이 더 높아서',
      '자동이체 수수료 때문',
    ],
    answer: 1,
  },
];

/** ---------- 상태 ---------- */
const categories = Array.from(new Set(QUIZ_BANK.map((q) => q.category)));
const selectedCategory = ref<'all' | string>('all');
const selectedDifficulty = ref<'all' | Difficulty>('all');
const quizCount = 10; // 한 세션의 문항 수

const started = ref(false);
const finished = ref(false);

const deck = ref<Quiz[]>([]);
const currentIndex = ref(0);
const chosenIndex = ref<number | null>(null);
const score = ref(0);

// 타이머(문항당)
const useTimer = ref(false);
const perQuestionLimit = 20; // seconds
const timeLeft = ref(perQuestionLimit);
let intervalId: number | null = null;

/** ---------- 로컬 최고점 ---------- */
const bestKey = computed(
  () => `finquiz_best_${selectedCategory.value}_${selectedDifficulty.value}`
);
const bestScore = ref<number | null>(null);
const bestUpdated = ref(false);

function loadBest() {
  const v = localStorage.getItem(bestKey.value);
  bestScore.value = v ? Number(v) : null;
}
function saveBest(s: number) {
  if (bestScore.value === null || s > bestScore.value) {
    bestScore.value = s;
    localStorage.setItem(bestKey.value, String(s));
    bestUpdated.value = true;
  } else {
    bestUpdated.value = false;
  }
}

/** ---------- 유틸 ---------- */
function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function sampleDeck(): Quiz[] {
  let pool = QUIZ_BANK.slice();
  if (selectedCategory.value !== 'all') {
    pool = pool.filter((q) => q.category === selectedCategory.value);
  }
  if (selectedDifficulty.value !== 'all') {
    pool = pool.filter((q) => q.difficulty === selectedDifficulty.value);
  }
  const picked = shuffle(pool).slice(0, quizCount);
  // 보기 순서도 섞고, 정답 인덱스 업데이트
  return picked.map((q) => {
    const idx = q.answer;
    const choices = shuffle(q.choices);
    const newAnswer = choices.indexOf(q.choices[idx]);
    return { ...q, choices, answer: newAnswer };
  });
}

/** ---------- 타이머 ---------- */
const timeLeftPct = computed(() =>
  Math.max(0, (timeLeft.value / perQuestionLimit) * 100)
);

function startTimer() {
  clearTimer();
  timeLeft.value = perQuestionLimit;
  intervalId = window.setInterval(() => {
    timeLeft.value -= 1;
    if (timeLeft.value <= 0) {
      timeLeft.value = 0;
      autoWrong();
    }
  }, 1000);
}
function clearTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

/** ---------- 파생 ---------- */
const currentQuestion = computed(() => deck.value[currentIndex.value]);
const answered = computed(() => chosenIndex.value !== null);
const isCorrect = computed(
  () => chosenIndex.value === currentQuestion.value?.answer
);
const progress = computed(() =>
  Math.round((currentIndex.value / quizCount) * 100)
);

// 정답/오답 개수 계산
const correctCount = computed(() => {
  // finished 상태에서만 계산
  if (!finished.value) return 0;
  let count = 0;
  for (let i = 0; i < deck.value.length && i < quizCount; i++) {
    // chosenIndex가 정답인 경우만 카운트
    if (
      deck.value[i].answer ===
      (i === currentIndex.value ? chosenIndex.value : -1)
    ) {
      count++;
    }
  }
  // 현재까지 점수로 대체 (score.value)
  return score.value;
});
const wrongCount = computed(() => quizCount - correctCount.value);

/** ---------- 동작 ---------- */
function startQuiz() {
  deck.value = sampleDeck();
  currentIndex.value = 0;
  chosenIndex.value = null;
  score.value = 0;
  started.value = true;
  finished.value = false;
  bestUpdated.value = false;
  if (useTimer.value) startTimer();
}

function reset() {
  started.value = false;
  finished.value = false;
  chosenIndex.value = null;
  deck.value = [];
  clearTimer();
  loadBest();
}

function choose(i: number) {
  if (answered.value) return;
  chosenIndex.value = i;
  if (isCorrect.value) score.value += 1;
  if (useTimer.value) clearTimer();
}

function skip() {
  if (answered.value) return;
  chosenIndex.value = -1; // 오답 처리
  if (useTimer.value) clearTimer();
}

function autoWrong() {
  if (!answered.value) {
    chosenIndex.value = -1;
    clearTimer();
  }
}

function next() {
  if (!answered.value) return;
  if (
    currentIndex.value + 1 >= quizCount ||
    currentIndex.value + 1 >= deck.value.length
  ) {
    // finish
    finished.value = true;
    started.value = false;
    saveBest(score.value);
    clearTimer();
  } else {
    currentIndex.value += 1;
    chosenIndex.value = null;
    if (useTimer.value) startTimer();
  }
}

/** ---------- 스타일 헬퍼 ---------- */
function choiceClass(i: number) {
  if (!answered.value)
    return 'border-surface-300 bg-white text-surface-800 hover:bg-surface-50 focus:ring-primary-300';
  const correct = currentQuestion.value?.answer === i;
  const chosen = chosenIndex.value === i;
  if (correct) return 'border-emerald-300 bg-emerald-50 text-emerald-800';
  if (chosen) return 'border-rose-300 bg-rose-50 text-rose-800';
  return 'border-surface-200 bg-white text-surface-400';
}
function difficultyBadgeClass(d: Difficulty) {
  switch (d) {
    case 'easy':
      return 'bg-emerald-100 text-emerald-800';
    case 'normal':
      return 'bg-amber-100 text-amber-800';
    case 'hard':
      return 'bg-rose-100 text-rose-800';
  }
}
function difficultyLabel(d: Difficulty) {
  return d === 'easy' ? '기초' : d === 'normal' ? '보통' : '심화';
}

/** ---------- watch & lifecycle ---------- */
watch([selectedCategory, selectedDifficulty], () => {
  if (!started.value) loadBest();
});
onBeforeUnmount(() => clearTimer());
loadBest();
</script>
