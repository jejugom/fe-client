<template>
  <div class="card-design mt-8 flex h-120 flex-col gap-8 px-8 py-16">
    <div class="flex flex-col items-center text-center">
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
import Btn from '@/components/buttons/Btn.vue';

interface Question {
  question: string;
  options: string[];
}

interface Props {
  question: Question;
  currentQuestionIndex: number;
  selectedAnswer: number | null;
}

interface Emits {
  (e: 'select-answer', index: number): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const selectAnswer = (index: number) => {
  emit('select-answer', index);
};
</script>
