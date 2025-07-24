<!-- 투자성향질문 -->
<template>
  <h2 class="text-primary-300 mb-8 text-2xl font-bold">
    자산 관리 계획 도우미
  </h2>

  <div class="flex min-h-screen flex-col">
    <div
      class="border-surface-200 stroke-primary mb-6 flex flex-col gap-3 rounded-xl border px-8 py-12"
    >
      <div class="space-y-8">
        <div class="flex flex-col items-center space-y-4">
          <h2 class="text-xl font-semibold">
            Q{{ currentQuestionIndex + 1 }}.
            {{ questions[currentQuestionIndex].question }}
          </h2>
          <p class="text-surface-400 text-center text-sm">
            한 가지만 골라 주세요.
            <br />
            바꾸시려면 다른 걸 눌러보세요.
          </p>
        </div>

        <div class="space-y-4">
          <button
            v-for="(option, index) in questions[currentQuestionIndex].options"
            :key="index"
            :class="[
              'w-full rounded-xl border py-4 text-center',
              selectedAnswers[currentQuestionIndex] === index
                ? 'border-gold bg-secondary-100'
                : 'border-surface-200',
            ]"
            @click="selectAnswer(index)"
          >
            {{ option }}
          </button>
        </div>
      </div>
    </div>

    <div class="mt-auto flex flex-col gap-3">
      <!-- 첫 문제가 아닐 때만 이전으로 버튼 표시 -->
      <Btn
        v-if="currentQuestionIndex > 0"
        @click="handlePrevQuestion"
        color="surface"
        label="이전으로"
        size="large"
      />

      <!-- 마지막 문제면 완료, 아니면 다음으로 버튼 표시 -->
      <Btn
        @click="handleNextQuestion"
        :color="isAnswerSelected ? 'primary' : 'surface'"
        :label="isLastQuestion ? '완료' : '다음으로'"
        size="large"
        :disabled="!isAnswerSelected"
        class="transition-colors duration-500"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Btn from '@/components/buttons/Btn.vue';

const router = useRouter();
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

    // TODO: 다음으로 지점 설정으로 넘어가는데, 뭔가 설명이 필요할 것 같음.
    router.push({ name: 'edit-branch' });
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
