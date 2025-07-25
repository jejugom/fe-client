<!-- 투자성향질문 -->
<template>
  <h1 class="text-primary-300 text-2xl font-bold"> 자산 관리 계획 도우미 </h1>

  <!-- 승아코멘트: 컴포넌트화 필요 -->
  <div
    class="stroke-primary mt-8 flex h-120 flex-col gap-8 rounded-xl px-8 py-16"
  >
    <div class="flex flex-col items-center text-center">
      <h1 class="text-primary-500 mb-4 text-lg font-semibold">
        Q{{ currentQuestionIndex + 1 }}.
        {{ questions[currentQuestionIndex].question }}
      </h1>
      <p class="text-surface-300">
        한 가지만 골라 주세요.
        <br />
        바꾸시려면 다른 걸 눌러보세요.
      </p>
    </div>

    <div class="space-y-4">
      <Btn
        v-for="(option, index) in questions[currentQuestionIndex].options"
        :key="index"
        :label="option"
        :color="
          selectedAnswers[currentQuestionIndex] === index
            ? 'secondary-stroke'
            : 'surface'
        "
        size="medium"
        class="w-full"
        @click="selectAnswer(index)"
      />
    </div>
  </div>

  <!-- 승아 코멘트: 컴포넌트화 필요->전체 컴포넌트로 작성해도 좋을 듯 -->
  <div
    class="fixed bottom-[calc(5rem+1rem)] left-1/2 box-border flex w-full max-w-150 -translate-x-1/2 flex-col gap-3 px-5"
  >
    <!-- 마지막 문제일 때 지점 설정 안내 텍스트 -->
    <!-- TODO: 프로필에서 넘어온 경우에는 설명 필요없음 -->
    <!-- TODO: 고정위치이다보니까, 영역 침범이 일어나서 수정 필요 -->
    <p v-if="isLastQuestion" class="text-surface-300 mb-2 text-center text-sm">
      다음으로 나의 지점 설정을 도와드릴게요.
    </p>

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
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Btn from '@/components/buttons/Btn.vue';

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
