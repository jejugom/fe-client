<template>
  <div v-if="currentQuestion" class="animate-fade-in">
    <div v-if="!gameFinished">
      <!-- 프로그레스바 -->
      <ProgressBar
        :currentQuestionIndex="currentQuestionIndex"
        :totalQuestions="currentQuizzes.length"
        class="mb-4"
      />

      <!-- 문제 -->
      <div class="mb-4">
        <h2 class="text-primary-500 text-2xl leading-relaxed font-bold">
          Q{{ currentQuestionIndex + 1 }}. {{ currentQuestion.question }}
        </h2>
      </div>

      <!-- 4개 선지 -->
      <!-- 정사각형 버전 -->
      <!-- <div class="mb-4 grid aspect-square grid-cols-2 gap-4"> -->

      <!-- 직사각형 버전 -->
      <div class="mb-4 flex w-full flex-col gap-y-4">
        <button
          v-for="(choice, index) in currentQuestion.choices"
          :key="index"
          @click="selectAnswer(index)"
          :disabled="answered"
          class="text-primary-500 bg-primary-100 transform rounded-2xl p-4 transition-all duration-300"
          :class="getChoiceClass(index)"
        >
          <!-- 선지 내용 -->
          <span class="text-center text-base font-semibold">{{ choice }}</span>
        </button>
      </div>

      <!-- 정답 확인 버튼 -->
      <div v-if="!answered && selectedAnswer !== null" class="text-center">
        <GlassBtn
          color="surface"
          label="정답 확인"
          size="large"
          @click="submitAnswer"
        />
      </div>
    </div>

    <!-- 퀴즈 완료 후 -->
    <div v-else class="pt-8 text-center">
      <div class="text-primary-500 mb-8">
        <h2 class="text-primary-500 mb-8 text-3xl font-bold"
          >오늘의 퀴즈가 모두 끝났어요!</h2
        >
        <div class="text-primary-500 mb-2 text-6xl font-bold">
          {{ score }} / {{ currentQuizzes.length }}
        </div>
        <p class="text-xl">
          정답률: {{ Math.round((score / currentQuizzes.length) * 100) }}%
        </p>
      </div>

      <div class="mx-auto mb-8 grid max-w-md grid-cols-2 gap-4">
        <!-- 정답 개수 -->
        <div
          class="text-primary-500 card-design bg-primary-100 transform rounded-2xl p-4"
        >
          <div class="text-4xl font-semibold">{{ score }}</div>
          <div class="text-lg">정답</div>
        </div>
        <!-- 오답 개수 -->
        <div
          class="text-primary-500 card-design transform rounded-2xl bg-red-100 p-4"
        >
          <div class="text-4xl font-semibold">{{
            currentQuizzes.length - score
          }}</div>
          <div class="text-lg">오답</div>
        </div>
      </div>

      <!-- 하단 버튼 -->
      <div class="flex flex-col justify-center gap-4">
        <GlassBtn
          color="surface"
          label="다시 도전하기"
          size="large"
          @click="restartQuiz"
        />
        <GlassBtn
          color="surface"
          label="다른 챌린지 하러가기"
          size="large"
          @click="goToEvent"
        />
      </div>
    </div>

    <QuizResultModal
      :showResultModal="showResultModal"
      :isCorrect="isCorrect"
      :currentQuestion="currentQuestion"
      :isLastQuestion="isLastQuestion"
      @confirm="handleModalConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import GlassBtn from '@/components/buttons/GlassBtn.vue';
import { quizBank, type Quiz } from '@/pages/event/quizData';
import { useRouter } from 'vue-router';
import QuizResultModal from './_components/QuizResultModal.vue';
import ProgressBar from '@/components/progressbar/ProgressBar.vue';
import { useRewardStore } from '@/stores/reward';

const router = useRouter();
const rewardStore = useRewardStore();

const emit = defineEmits<{
  (e: 'quiz-finished'): void;
}>();

// 상태 관리
const gameFinished = ref(false);
const currentQuizzes = ref<Quiz[]>([]);
const currentQuestionIndex = ref(0);
const selectedAnswer = ref<number | null>(null);
const answered = ref(false);
const score = ref(0);
const bestScore = ref(0);
const isNewBest = ref(false);
const showResultModal = ref(false);

// 상수
const quizPerDay = 7;

// 계산된 속성
const currentQuestion = computed<Quiz>(
  () => currentQuizzes.value[currentQuestionIndex.value]
);
const isCorrect = computed(
  () => selectedAnswer.value === currentQuestion.value?.answer
);
const isLastQuestion = computed(
  () => currentQuestionIndex.value === currentQuizzes.value.length - 1
);

// 함수들
const getChoiceClass = (index: number) => {
  if (!answered.value) {
    // 아직 정답 제출 전, 단순 선택
    return selectedAnswer.value === index
      ? 'border-primary-300 border'
      : 'bg-surface-100 card-design';
  }

  const isAnswer = index === currentQuestion.value.answer;
  const isSelected = index === selectedAnswer.value;

  if (isAnswer) {
    // 정답 선지 강조
    return 'bg-primary-100  border border-primary-300';
  }

  if (isSelected && !isAnswer) {
    // 오답 선택
    return 'bg-red-100 text-red-300 border border-red-300';
  }

  // 나머지 보기 (선택도 안했고, 정답도 아님)
  return 'card-design bg-surface-100';
};

const startQuiz = () => {
  currentQuizzes.value = quizBank.slice(
    0,
    Math.min(quizPerDay, quizBank.length)
  );

  currentQuestionIndex.value = 0;
  selectedAnswer.value = null;
  answered.value = false;
  score.value = 0;
  gameFinished.value = false;
  isNewBest.value = false;
};

const selectAnswer = (index: number) => {
  if (answered.value) return;
  selectedAnswer.value = index;
};

const submitAnswer = () => {
  answered.value = true;
  if (isCorrect.value) {
    score.value++;
  }
  // 바텀시트 표시
  showResultModal.value = true;
};

// 버튼 클릭 시 다음 문제로 진행
const handleModalConfirm = () => {
  showResultModal.value = false;

  // 약간의 딜레이 후 다음 단계로 진행
  setTimeout(() => {
    if (isLastQuestion.value) {
      finishQuiz();
    } else {
      nextQuestion();
    }
  }, 300);
};

const nextQuestion = () => {
  currentQuestionIndex.value++;
  selectedAnswer.value = null;
  answered.value = false;
};

const finishQuiz = () => {
  gameFinished.value = true;
  rewardStore.complete('quiz');

  const savedBest = parseInt(
    localStorage.getItem('financeQuizBestScore') || '0'
  );
  if (score.value > savedBest) {
    bestScore.value = score.value;
    localStorage.setItem('financeQuizBestScore', score.value.toString());
    isNewBest.value = true;
  }
  emit('quiz-finished');
};

const restartQuiz = () => {
  startQuiz();
};

const goToEvent = () => {
  router.push('/event');
};

onMounted(() => {
  startQuiz();
  const savedBest = parseInt(
    localStorage.getItem('financeQuizBestScore') || '0'
  );
  bestScore.value = savedBest;
});
</script>
