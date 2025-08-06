<template>
  <div class="space-y-16">
    <div class="space-y-4">
      <div class="flex items-end justify-between">
        <div class="text-primary-300 text-2xl font-bold"
          >오늘의 금융시장은?</div
        >
        <TextBtn
          @click="toggleShowMore"
          color="primary"
          size="medium"
          :label="showMore ? '접기' : '더보기'"
      /></div>

      <NewsCard v-if="filteredNews.length > 0" :newsItem="filteredNews[0]" />

      <!-- 더보기 토글 -->
      <div v-if="showMore">
        <NewsCard
          v-for="(item, index) in filteredNews.slice(1)"
          :key="index"
          :newsItem="item"
          class="mt-2"
        />
      </div>

      <div class="flex justify-center"> </div>
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
      <div class="text-primary-300 text-2xl font-bold">챌린지 현황</div>
      <ChallengeState />
      <Btn
        color="primary"
        label="보상 선택하기"
        size="large"
        @click="router.push({ name: 'event-reward' })"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, Text } from 'vue';
import { fetchEventData } from '@/api/event/event';
import NewsCard from '@/components/cards/NewsCard.vue';
import IconCard from '@/components/cards/IconCard.vue';
import { useRouter } from 'vue-router';
import Number from '@/assets/icons/Number.svg';
import Quiz from '@/assets/icons/Quiz.svg';
import Park from '@/assets/icons/Park.svg';
import TextBtn from '@/components/buttons/TextBtn.vue';
import Btn from '@/components/buttons/Btn.vue';
import ChallengeState from './_components/ChallengeState.vue';
const router = useRouter();

const showMore = ref(false);
const toggleShowMore = () => {
  showMore.value = !showMore.value;
};

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
