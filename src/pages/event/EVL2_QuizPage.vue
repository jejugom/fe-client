<template>
  <div class="flex min-h-screen flex-col">
    <div v-if="!gameStarted" class="animate-fade-in mb-8">
      <div>
        <h1 class="text-gold mb-2 text-base">{{ currentWeekText }}</h1>
        <p class="text-primary-500 mb-4 text-3xl font-semibold"
          >금융 퀴즈에 도전하세요</p
        >
        <p class="text-primary-500 mb-8">
          매주 달라지는 퀴즈로 두뇌도 깨우고, 리워드도 받아가세요!
          <br />누구나 쉽게 풀 수 있는 퀴즈로 일상 속 금융을 익혀보아요.
        </p>
      </div>

      <section
        class="mb-4 h-80 bg-cover bg-center"
        :style="{ backgroundImage: `url(${financeQuizBanner})` }"
      ></section>

      <GlassBtn
        @click="startQuiz"
        color="secondary"
        label="정답에 도전하기"
        size="large"
      />
    </div>

    <FinanceQuiz v-if="gameStarted" @quiz-finished="gameStarted = false" />
  </div>
</template>

<script setup lang="ts">
import GlassBtn from '@/components/buttons/GlassBtn.vue';
import { ref, computed } from 'vue';
import financeQuizBanner from '@/assets/images/financeQuiz.png';
import FinanceQuiz from './_components/FinanceQuiz.vue';

const weekNumberToKorean = (number: number): string => {
  const weeks: string[] = ['첫', '둘', '셋', '넷', '다섯', '여섯'];
  return weeks[number - 1] || String(number);
};

const currentWeekText = computed<string>(() => {
  const today: Date = new Date();
  const year: number = today.getFullYear();
  const month: number = today.getMonth() + 1;
  const date: number = today.getDate();
  const firstDay: number = new Date(year, month - 1, 1).getDay();
  const weekOfMonth: number = Math.ceil((date + firstDay) / 7);
  const weekText: string = weekNumberToKorean(weekOfMonth);

  return `${year}년 ${month}월 ${weekText}째 주`;
});

const gameStarted = ref(false);

const startQuiz = () => {
  gameStarted.value = true;
};
</script>
]
