<template>
  <div class="card-design mt-8 flex min-h-120 flex-col gap-8 px-8 py-8">
    <!-- 프로그레스바 -->
    <ProgressBar
      :currentQuestionIndex="currentQuestionIndex"
      :totalQuestions="totalQuestions"
    />

    <div class="mt-4 flex flex-col items-center text-center">
      <h1 class="text-primary-500 mb-4 text-lg font-semibold">
        Q{{ currentQuestionIndex + 1 }}.
        {{ question.question }}
      </h1>
      <p class="text-surface-300">
        한 가지만 골라 주세요.
        <br />
        바꾸시려면 다른 걸 눌러보세요.
      </p>
    </div>

    <div class="space-y-4">
      <Btn
        v-for="(option, index) in question.options"
        :key="index"
        :label="option"
        :color="selectedAnswer === index ? 'secondary-stroke' : 'surface'"
        size="medium"
        class="w-full"
        @click="selectAnswer(index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Btn from '@/components/buttons/Btn.vue';
import ProgressBar from '@/components/progressbar/ProgressBar.vue';

interface Question {
  question: string;
  options: string[];
}

interface Props {
  question: Question;
  currentQuestionIndex: number;
  selectedAnswer: number | null;
  totalQuestions: number;
}

interface Emits {
  (e: 'select-answer', index: number): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

// 답변 선택 함수
function selectAnswer(index: number) {
  emit('select-answer', index);
}
</script>
