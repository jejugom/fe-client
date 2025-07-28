<template>
  <h2 class="text-primary-300 mb-2 text-2xl font-bold">증여 시뮬레이션 질문</h2>
  <p class="mb-8 text-base">
    증여 계획을 쉽게 정리할 수 있도록 질문을 통해 도와드립니다.
  </p>
  <GiftQuizBox
    :question="currentQuestion"
    :selectedValue="selectedAnswer"
    @select="(val: string) => (selectedAnswer = val)"
  />

  <BtnSet
    :label1="step > 0 ? '이전으로' : ''"
    @click1="goToPrev"
    :label2="step === questions.length - 1 ? '완료' : '다음으로'"
    @click2="goToNext"
    type="type2"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import GiftQuizBox from './_components/GiftQuizBox.vue';
import { giftQuizQuestions as questions } from './_quizDummy';
import BtnSet from '@/components/buttons/BtnSet.vue';
const router = useRouter();

const step = ref(0);
const selectedAnswer = ref('');
const answers = ref<string[]>([]);

const currentQuestion = computed(() => questions[step.value]);

// 결과 페이지로 이동
function goToNext() {
  answers.value[step.value] = selectedAnswer.value;
  selectedAnswer.value = '';

  if (step.value < questions.length - 1) {
    step.value++;
  } else {
    console.log('사용자 응답:', answers.value);
    router.push({ name: 'gift-result', params: { answers: answers.value } });
  }
}

function goToPrev() {
  if (step.value > 0) {
    step.value--;
    selectedAnswer.value = answers.value[step.value] || '';
  }
}
</script>

<style scoped></style>
