<template>
  <div class="p-4">
    <h2 class="mb-3 text-xl font-bold">{{ currentQuestion.title }}</h2>
    <p class="mb-5 text-sm whitespace-pre-line text-gray-600">{{
      currentQuestion.description
    }}</p>

    <div class="mb-6 flex flex-col gap-3">
      <button
        v-for="(option, idx) in currentQuestion.options"
        :key="idx"
        :class="[
          'rounded-lg border p-4 text-base font-semibold',
          selectedAnswer === option.value
            ? 'border-yellow-400 bg-yellow-100'
            : 'border-gray-200 bg-white',
        ]"
        @click="selectedAnswer = option.value"
      >
        {{ option.label }}
      </button>
    </div>

    <button
      class="w-full rounded-lg bg-blue-400 py-4 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="!selectedAnswer"
      @click="goToNext"
    >
      다음으로
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const step = ref(0);
const selectedAnswer = ref('');
const answers = ref<string[]>([]);

const questions = [
  {
    title: 'Q1. 세금은 누가 부담하시나요?',
    description:
      '세금을 누가 낼지에 따라 최종 증여액과\n세금 계산 방식이 달라집니다.',
    options: [
      { label: '내가 대신 내줄 계획', value: '1' },
      { label: '자녀/배우자가 내게 할 예정', value: '2' },
      { label: '아직 고민 중', value: '3' },
    ],
  },
  {
    title: 'Q2. 자산을 나눠주는 방식을 어떻게 고려하고 계신가요?',
    description:
      '증여 시기와 수증자 수를 나누면\n절세 전략을 세우는 데 도움이 됩니다.',
    options: [
      { label: '한 번에 증여', value: '1' },
      { label: '시간을 나눠서 증여', value: '2' },
      { label: '수증자에게 나눠서 증여', value: '3' },
      { label: '아직 정하지 못함', value: '4' },
    ],
  },
  {
    title: 'Q3. 첫 증여는 언제쯤 시작할 계획이신가요?',
    description:
      '증여 시점에 따라 공제 여부와\n세법 적용이 달라질 수 있습니다.',
    options: [
      { label: '올해(2025년)', value: '1' },
      { label: '내년(2026년)', value: '2' },
      { label: '5년 이내 시작(~2029년)', value: '3' },
      { label: '당장 급하지 않음', value: '4' },
    ],
  },
  {
    title: 'Q4. 얼마씩 나눠주실 생각이신가요?',
    description: '자산 분배 방식에 따라\n자녀별 세금과 전략이 달라집니다.',
    options: [
      { label: '동등하게 나눌 예정', value: '1' },
      { label: '각각 다르게 줄 예정', value: '2' },
      { label: '아직 정하지 못함', value: '3' },
    ],
  },
];

const currentQuestion = computed(() => questions[step.value]);

function goToNext() {
  answers.value[step.value] = selectedAnswer.value;
  selectedAnswer.value = '';

  if (step.value < questions.length - 1) {
    step.value++;
  } else {
    console.log('사용자 응답:', answers.value);
    router.push('/jeungyeo/result'); // 결과 페이지로 이동
  }
}
</script>

<style scoped></style>
