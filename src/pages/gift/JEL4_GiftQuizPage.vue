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

  <div>
    <!-- 승아코멘트: 컴포넌트화 필요(자산연동에도 똑같이 있기에 한명이 맡아서 한 후에 사용하는 방식으로 하면 좋을 듯) -->
    <Btn
      v-if="step > 0"
      @click="goToPrev"
      color="surface"
      label="이전 문항으로 돌아가기"
      size="large"
    />
    <Btn
      class="mt-3"
      :class="[
        selectedAnswer
          ? 'bg-primary-100 text-surface-500'
          : 'border-surface-200 border bg-transparent',
      ]"
      :disabled="!selectedAnswer"
      @click="goToNext"
      color="primary"
      :label="step === questions.length - 1 ? '결과 확인하기' : '다음으로'"
      size="large"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Btn from '@/components/buttons/Btn.vue';
import GiftQuizBox from './_components/GiftQuizBox.vue';
import { giftQuizQuestions as questions } from './_quizDummy';

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
