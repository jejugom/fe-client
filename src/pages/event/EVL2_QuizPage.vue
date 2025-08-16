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

    <QuizResultModal
      :showResultModal="showResultModal"
      :isCorrect="isCorrect"
      :currentQuestion="currentQuestion"
      :isLastQuestion="isLastQuestion"
      @confirm="handleModalConfirm"
    />

    <Confirm
      v-if="showConfirm"
      :title="confirmTitle"
      leftLabel="아니오"
      rightLabel="예"
      @click1="onConfirmNo"
      @click2="onConfirmYes"
    >
      <p class="text-center whitespace-pre-line">{{ confirmMessage }}</p>
    </Confirm>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import GlassBtn from '@/components/buttons/GlassBtn.vue';
import { type Quiz } from '@/types/event/quiz.d';
import { useRouter } from 'vue-router';
import QuizResultModal from './_components/QuizResultModal.vue';
import ProgressBar from '@/components/progressbar/ProgressBar.vue';
import { useRewardStore } from '@/stores/reward';
import { getQuiz } from '@/api/event/quiz';
import Confirm from '@/components/modals/Confirm.vue';

const router = useRouter();
const rewardStore = useRewardStore();

const emit = defineEmits<{ (e: 'quiz-finished'): void }>();

/* ---------- Confirm ---------- */
const showConfirm = ref(false);
const confirmTitle = ref<string>();
const confirmMessage = ref('');

const openConfirm = (message: string, title?: string) => {
  confirmMessage.value = message;
  confirmTitle.value = title;
  showConfirm.value = true;
};
const onConfirmNo = () => {
  showConfirm.value = false;
  restartQuiz();
};
const onConfirmYes = () => {
  showConfirm.value = false;
  goToEvent();
};

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

const startQuiz = async () => {
  // 1. 오늘 날짜를 가져온다
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const cachedQuizzes = sessionStorage.getItem('dailyQuiz');

  if (cachedQuizzes) {
    const { date, quizzes } = JSON.parse(cachedQuizzes);
    // 2. 저장된 퀴즈의 날짜가 오늘과 같은지 비교한다
    if (date === today) {
      // 3. 날짜가 같으면, api를 호출하지 않고 저장된 퀴즈를 사용한다.
      currentQuizzes.value = quizzes;
    } else {
      // 4. 날짜가 다르면 새로운 퀴즈를 api로 요청해서 가져옴
      await fetchAndCacheQuizzes();
    }
  } else {
    // 5. 캐시된 퀴즈가 없어도 새로운 퀴즈를 가져옴
    await fetchAndCacheQuizzes();
  }

  // 퀴즈 상태 초기화
  currentQuestionIndex.value = 0;
  selectedAnswer.value = null;
  answered.value = false;
  score.value = 0;
  gameFinished.value = false;
  isNewBest.value = false;
};

// api로 퀴즈를 요청하고, 오늘 날짜와 함께 ssessionStorage에 저장
const fetchAndCacheQuizzes = async () => {
  try {
    const quizzes = await getQuiz(); // 실제 api 호출
    currentQuizzes.value = quizzes;
    const today = new Date().toISOString().split('T')[0];
    // 받아온 퀴즈를 오늘 날짜와 함께 저장
    sessionStorage.setItem(
      'dailyQuiz',
      JSON.stringify({ date: today, quizzes })
    );
  } catch (error) {
    console.error('퀴즈 데이터 로딩 실패:', error);
    // TODO: 사용자에게 에러 메시지를 보여주는 로직 추가
  }
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

  const quizLength = currentQuizzes.value.length;
  const accuracy =
    quizLength > 0 ? Math.round((score.value / quizLength) * 100) : 0;
  const message =
    `정답: ${score.value}개, 오답: ${quizLength - score.value}개\n` +
    `정답률: ${accuracy}%\n\n` +
    `생활편의 페이지로 돌아가겠습니까?`;
  openConfirm(message, '🎉 챌린지 완료');
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
