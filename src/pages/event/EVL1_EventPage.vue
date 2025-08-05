<template>
  <div class="space-y-16">
    <div class="space-y-4">
      <div class="text-primary-300 text-2xl font-bold">오늘의 금융시장은?</div>
      <Carousel :items="newsList">
        <template #default="{ item }">
          <div class="flex w-full justify-center">
            <NewsCard :newsItem="item" class="m-1 w-4/5"
          /></div>
        </template>
      </Carousel>
    </div>
    <div class="space-y-4">
      <div class="text-primary-300 text-2xl font-bold">매일매일 NHDR PLAY</div>
      <IconCard
        class="max-h-20"
        color="primary"
        v-for="(card, index) in card"
        :key="index"
        :title="card.title"
        :content1="card.content1"
        @click="handlers[card.onClick]"
      >
        <template #icon>
          <img :src="card.src" class="h-10 w-10" />
        </template>
      </IconCard>
    </div>
    <div class="space-y-4">
      <div class="text-primary-300 text-2xl font-bold">말동무가 되어드려요</div>
      <IconCard
        color="secondary"
        title="챗봇"
        @click="() => router.push({ name: 'chatbot' })"
      >
        <template #icon>
          <img :src="ChatBot" class="h-18" />
        </template>
      </IconCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { fetchEventData } from '@/api/event/event';
import NewsCard from '@/components/cards/NewsCard.vue';
import Carousel from '@/components/carousel/Carousel.vue';
import IconCard from '@/components/cards/IconCard.vue';
import { useRouter } from 'vue-router';
import Number from '@/assets/icons/Number.svg';
import Quiz from '@/assets/icons/Quiz.svg';
import Park from '@/assets/icons/Park.svg';
import ChatBot from '@/assets/icons/chatbot.png';
const router = useRouter();

const newsList = ref<
  Array<{
    category: number;
    title: string;
    summary: string;
    link: string;
    date: string;
  }>
>([]);

// 카드 데이터
const card = [
  {
    title: '금융 지식 퀴즈',
    content1: '내 자산은 내가 직접!',
    onClick: 'goToQuiz',
    src: Quiz,
  },
  {
    title: '숫자 빨리 누르기 게임',
    content1: '내 두뇌 나이는 몇살?',
    onClick: 'goToNumberGame',
    src: Number,
  },
  {
    title: '공원 방문 챌린지',
    content1: '오늘은 공원에 가볼까요?',
    onClick: 'goToParkChallenge',
    src: Park,
  },
];
const handlers: Record<string, () => void> = {
  goToQuiz: () => {
    router.push({ name: 'event-quiz' });
  },
  goToNumberGame: () => {
    router.push({ name: 'event-number' });
  },
  goToParkChallenge: () => {
    router.push({ name: 'event-park' });
  },
};

onMounted(async () => {
  try {
    const result = await fetchEventData();
    console.log('Fetched:', result);
    newsList.value = result;
  } catch (error) {
    console.error('이벤트 데이터 로딩 실패', error);
  }
});

// 오늘 날짜 포맷
const today = new Date();
const todayString = `${today.getFullYear()}-${String(
  today.getMonth() + 1
).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

// category 0만 필터링
const filteredNews = computed(() =>
  newsList.value.filter((item) => item.category === 0)
);

// 날짜 변환 함수
function formatDate(dateStr: string): string {
  const timeOnlyPattern = /^\d{1,2}:\d{2}$/;
  if (timeOnlyPattern.test(dateStr)) {
    return `오늘 ${dateStr}`;
  }
  return dateStr;
}
</script>
