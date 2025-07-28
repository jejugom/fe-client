<template>
  <!-- TODO: 고정위치이다보니까, 영역 침범이 일어나서 수정 필요 -->
  <!-- fixed 가 아닌, 아래에 붙는 형식으로 수정 -->
  <div
    class="fixed bottom-[calc(5rem+1rem)] left-1/2 box-border flex w-full max-w-150 -translate-x-1/2 flex-col gap-3 px-5"
  >
    <!-- 마지막 문제일 때 지점 설정 안내 텍스트 -->
    <!-- TODO: 프로필에서 넘어온 경우에는 설명 필요없음 -->
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
import Btn from '@/components/buttons/Btn.vue';

// 프로퍼티 타입 정의
interface Props {
  currentQuestionIndex: number;
  isLastQuestion: boolean;
  isAnswerSelected: boolean;
}

// 이벤트 타입 정의
interface Emits {
  (e: 'prev-question'): void;
  (e: 'next-question'): void;
}

// 프로퍼티 정의
defineProps<Props>();

// 이벤트 정의
const emit = defineEmits<Emits>();

// 이전 질문 이동
const handlePrevQuestion = () => {
  emit('prev-question');
};

// 다음 질문 이동
const handleNextQuestion = () => {
  emit('next-question');
};
</script>
