<template>
  <div ref="rootRef">
    <!-- 마지막 문제일 때 지점 설정 안내 텍스트 표시 -->
    <p
      v-if="isLastQuestion"
      class="text-primary-500 mb-2 text-center font-semibold"
    >
      다음으로 나의 지점 설정을 도와드릴게요.
    </p>
    <!-- 퀴즈 네비게이션 버튼 -->
    <BtnSet
      :label1="currentQuestionIndex > 0 ? '이전으로' : ''"
      @click1="handlePrevQuestion"
      :label2="isLastQuestion ? '완료' : '다음으로'"
      @click2="handleNextQuestion"
      type="type2"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, defineExpose } from 'vue';
import BtnSet from '@/components/buttons/BtnSet.vue';
const rootRef = ref<HTMLElement | null>(null);
defineExpose({
  rootRef,
});
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
function handlePrevQuestion() {
  emit('prev-question');
}

// 다음 질문 이동
function handleNextQuestion() {
  emit('next-question');
}
</script>
