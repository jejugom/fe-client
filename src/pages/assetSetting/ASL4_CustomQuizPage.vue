<!-- 투자성향질문 -->
<template>
  <QuizHeader />
  
  <QuizContent
    :question="questions[currentQuestionIndex]"
    :current-question-index="currentQuestionIndex"
    :selected-answer="selectedAnswers[currentQuestionIndex]"
    @select-answer="selectAnswer"
  />

  <QuizNavigation
    :current-question-index="currentQuestionIndex"
    :is-last-question="isLastQuestion"
    :is-answer-selected="isAnswerSelected"
    @prev-question="handlePrevQuestion"
    @next-question="handleNextQuestion"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import QuizHeader from './_components/QuizHeader.vue';
import QuizContent from './_components/QuizContent.vue';
import QuizNavigation from './_components/QuizNavigation.vue';

const router = useRouter();
const route = useRoute();
const currentQuestionIndex = ref(0);

// 질문 목록 정의
const questions = [
  {
    question: '투자 경험이 있으신가요?',
    options: ['아니오', '조금 있어요', '투자경험이 많아요'],
  },
  {
    question: '융자를 통한 더 빠른 자산 증식을 선호하시나요?',
    options: ['O', 'X'],
  },
  {
    question: '투자 후 가격이 하락하면 어떻게 하나요?',
    options: ['추가 매수해요', '조금 더 지켜봐요', '팔아요'],
  },
  {
    question: '투자 상품을 자주 비교하시나요?',
    options: ['아니요', '가끔 비교해요', '자주 비교해요'],
  },
  {
    question: '수익률이 낮아도 원금이 보장되는 상품을 선호하시나요?',
    options: ['O', 'X'],
  },
];

const isLastQuestion = computed(() => {
  return currentQuestionIndex.value === questions.length - 1;
});

// 답변 저장을 위한 인터페이스 정의
interface QuizAnswers {
  [key: string]: number | null;
}

// 배열을 null로 초기화 (questions.length 만큼)
const selectedAnswers = ref<(number | null)[]>(
  new Array(questions.length).fill(null)
);
const finalAnswers = ref<QuizAnswers>({} as QuizAnswers);

// 버튼 비활성화 조건을 수정
const isAnswerSelected = computed(() => {
  return selectedAnswers.value[currentQuestionIndex.value] !== null;
});

const handlePrevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
};

const handleNextQuestion = () => {
  const questionNumber = `q${currentQuestionIndex.value + 1}`;
  const currentAnswer = selectedAnswers.value[currentQuestionIndex.value];

  if (currentAnswer !== null) {
    finalAnswers.value[questionNumber] = currentAnswer;
  }

  if (isLastQuestion.value) {
    console.log('최종 답변:', finalAnswers.value);
    // TODO: 여기에 API 호출 로직 추가
    // 성공 시 다음 페이지로 이동
    // 실패 시 에러 메시지 표시

    // 프로필에서 온 경우 마이페이지로 돌아가기
    const isFromProfile = route.query.from === 'profile';

    if (isFromProfile) {
      router.push({ name: 'profile' });
    } else {
      // 기본 플로우: 지점 설정으로 이동
      router.push({ name: 'edit-branch' });
    }
  } else {
    currentQuestionIndex.value++;
  }
};

const selectAnswer = (index: number) => {
  const newAnswers = [...selectedAnswers.value];
  newAnswers[currentQuestionIndex.value] = index;
  selectedAnswers.value = newAnswers;
};
</script>
