<template>
  <div ref="rootRef">
    <!-- TODO: 고정위치이다보니까, 영역 침범이 일어나서 수정 필요 -->
    <!-- fixed 가 아닌, 아래에 붙는 형식으로 수정 -->
    <!-- 마지막 문제일 때 지점 설정 안내 텍스트 -->
    <!-- TODO: 프로필에서 넘어온 경우에는 설명 필요없음 -->
    <p v-if="isLastQuestion" class="text-surface-300 mb-2 text-center text-sm">
      다음으로 나의 지점 설정을 도와드릴게요.
    </p>
    <!-- 이전/다음 버튼 -->
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
const handlePrevQuestion = () => {
  emit('prev-question');
};

// 다음 질문 이동
const handleNextQuestion = () => {
  emit('next-question');
};
</script>
