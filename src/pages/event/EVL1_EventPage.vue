<template>
  <div class="space-y-16">
    <!-- 무엇이든 물어보세요 -->
    <Question></Question>

    <!-- 매일매일 -->
    <div class="space-y-4">
      <div class="text-primary-500 text-2xl font-bold"
        >오늘의 노후도락 PLAY</div
      >
      <p class="text-primary-500 text-base"
        >매일매일 작지만 소중한 습관,<br />노후도락과 함께 3가지 활동을 실천하고
        작은 선물도 받아보세요.</p
      >
      <!-- 챌린지 현황 / 보상 -->
      <div class="space-y-4">
        <ChallengeState :points="todayPoint">
          <Btn
            :color="rewardStore.allCompleted ? 'primary' : 'surface'"
            :disabled="!rewardStore.allCompleted"
            :label="
              rewardStore.allCompleted
                ? '포인트리로 전환하기'
                : '오늘의 노후도락 PLAY를 완료해 주세요'
            "
            size="large"
            @click="onClickClaim"
          />
        </ChallengeState>
      </div>
    </div>

    <!-- 이벤트 카드 캐러셀 -->
    <div class="relative overflow-hidden">
      <!-- 캐러셀 컨테이너 -->
      <div
        class="flex transition-transform duration-300 ease-out"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      >
        <div v-for="(c, i) in card" :key="i" class="w-full flex-shrink-0">
          <EventCard
            class="mx-2 h-24"
            color="primary"
            :title="c.title"
            :content1="c.content1"
            :content2="c.content2"
            @click="handlers[c.onClick]"
            :src="c.src"
          />
        </div>
      </div>

      <!-- 인디케이터 -->
      <div class="mt-4 flex justify-center space-x-2">
        <button
          v-for="(_, i) in card"
          :key="i"
          class="h-2 w-2 rounded-full transition-colors duration-200"
          :class="currentIndex === i ? 'bg-primary-500' : 'bg-surface-300'"
          @click="goToSlide(i)"
        />
      </div>

      <!-- 좌우 네비게이션 버튼 -->
      <button
        v-if="card.length > 1"
        class="text-primary-500 absolute top-1/2 left-2 -translate-y-1/2 transform rounded-full bg-white p-3 font-bold opacity-75 shadow-md transition-colors duration-200"
        @click="prevSlide"
      >
        ‹
      </button>

      <button
        v-if="card.length > 1"
        class="text-primary-500 absolute top-1/2 right-2 -translate-y-1/2 transform rounded-full bg-white p-3 font-bold opacity-75 shadow-md transition-colors duration-200"
        @click="nextSlide"
      >
        ›
      </button>
    </div>

    <!-- 오늘의 금융시장 -->
    <div class="space-y-4">
      <div class="flex items-end justify-between">
        <div class="text-primary-500 text-2xl font-bold"
          >오늘의 금융시장은?</div
        >
        <TextBtn
          @click="toggleShowMore"
          color="primary"
          size="medium"
          class="text-surface-300"
          :label="showMore ? '접기' : '더보기'"
        />
      </div>

      <NewsCard v-if="filteredNews.length > 0" :newsItem="filteredNews[0]" />

      <div v-if="showMore">
        <NewsCard
          v-for="(item, index) in filteredNews.slice(1)"
          :key="index"
          :newsItem="item"
          class="mt-2"
        />
      </div>
    </div>
  </div>

  <Confirm
    v-if="showConfirm"
    title="보상 받기"
    leftLabel="취소"
    rightLabel="확인"
    @click1="onConfirmNo"
    @click2="onConfirmYes"
  >
    <p class="text-center whitespace-pre-line">
      오늘의 노후도락 PLAY를 포인트리로 변환하겠습니까? <br />
      변환 후 노후도락 PLAY 현황은 초기화됩니다.
    </p>
  </Confirm>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { fetchEventData, postEventData } from '@/api/event/event';
import { useRouter } from 'vue-router';
import { useRewardStore } from '@/stores/reward';
import NewsCard from '@/components/cards/NewsCard.vue';
import TextBtn from '@/components/buttons/TextBtn.vue';
import Btn from '@/components/buttons/Btn.vue';
import ChallengeState from './_components/ChallengeState.vue';
import Quiz from '@/assets/images/QuizBanner.webp';
import Number from '@/assets/images/NumberBanner.webp';
import Park from '@/assets/images/ParkBanner.webp';
import Confirm from '@/components/modals/Confirm.vue';
import Question from '@/components/question/Question.vue';
import EventCard from './_components/EventCard.vue';
import { useLoadingStore } from '@/stores/loading';

const router = useRouter();
const rewardStore = useRewardStore();
const loadingStore = useLoadingStore();

const showMore = ref(false);
const showConfirm = ref(false);
const toggleShowMore = () => (showMore.value = !showMore.value);

// 캐러셀 관련 상태
const currentIndex = ref(0);
const touchStartX = ref(0);
const touchEndX = ref(0);
const isDragging = ref(false);

// 서버 데이터 상태
const newsList = ref<
  Array<{
    category: number;
    title: string;
    summary: string;
    link: string;
    date: string;
  }>
>([]);
const todayPoint = ref<number | null>(null);

onMounted(async () => {
  loadingStore.startLoading();
  try {
    const result = await fetchEventData();
    // 여기! 배열만 따로 넣어야 함
    newsList.value = Array.isArray(result.news) ? result.news : [];
    todayPoint.value = typeof result.point === 'number' ? result.point : null;
  } catch (e) {
    console.error('이벤트 데이터 로딩 실패', e);
    newsList.value = [];
    todayPoint.value = null;
  } finally {
    loadingStore.stopLoading();
  }

  // 자동 슬라이드 (옵션)
  startAutoSlide();
});

// 카드 목록/핸들러 동일
const card = [
  {
    title: '금융 지식 퀴즈',
    content1: '매일 달라지는 퀴즈로 두뇌를 깨워보세요!',
    content2: '누구나 쉽게 풀 수 있는 퀴즈로 금융을 익혀보아요.',
    onClick: 'goToQuiz',
    src: Quiz,
  },
  {
    title: '숫자 빨리 누르기 게임',
    content1: '반짝이는 순발력, 당신의 손끝에서 빛을 발하다!',
    content2: '제한 시간 안에 숫자를 빠르게 찾아 눌러보세요.',
    onClick: 'goToNumberGame',
    src: Number,
  },
  {
    title: '공원 방문 챌린지',
    content1: '근처 공원에 들러 걷기만 해도 건강해져요.',
    content2: '오늘의 작은 발걸음이 내일의 활력으로 이어집니다.',
    onClick: 'goToParkChallenge',
    src: Park,
  },
];
const handlers: Record<string, () => void> = {
  goToQuiz: () => router.push({ name: 'event-quiz' }),
  goToNumberGame: () => router.push({ name: 'event-number' }),
  goToParkChallenge: () => router.push({ name: 'event-park' }),
};

// 캐러셀 메서드
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % card.length;
};

const prevSlide = () => {
  currentIndex.value =
    currentIndex.value === 0 ? card.length - 1 : currentIndex.value - 1;
};

const goToSlide = (index: number) => {
  currentIndex.value = index;
};

// 터치 이벤트 처리
const onTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX;
  isDragging.value = true;
};

const onTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return;
  e.preventDefault(); // 스크롤 방지
};

const onTouchEnd = (e: TouchEvent) => {
  if (!isDragging.value) return;

  touchEndX.value = e.changedTouches[0].clientX;
  const deltaX = touchStartX.value - touchEndX.value;
  const minSwipeDistance = 50; // 최소 스와이프 거리

  if (Math.abs(deltaX) > minSwipeDistance) {
    if (deltaX > 0) {
      // 왼쪽으로 스와이프 (다음 슬라이드)
      nextSlide();
    } else if (deltaX < 0) {
      // 오른쪽으로 스와이프 (이전 슬라이드)
      prevSlide();
    }
  }

  isDragging.value = false;
};

// 자동 슬라이드 (옵션)
const startAutoSlide = () => {
  setInterval(() => {
    nextSlide(); // 무한 순환으로 변경
  }, 5000); // 5초마다 자동 슬라이드
};

// 카테고리 0만
const filteredNews = computed(() =>
  newsList.value.filter((n) => n.category === 0)
);

function onClickClaim() {
  if (!rewardStore.allCompleted) return; // 방어
  showConfirm.value = true;
}

async function onConfirmYes() {
  showConfirm.value = false;
  try {
    // 요구사항: 확인 시 스토어 초기화 → API 호출
    rewardStore.resetToday();
    await postEventData();
    window.location.reload();
    // 필요하면 토스트/알럿 추가 가능
  } catch (e) {
    console.error('보상 적립 실패', e);
  }
}
function onConfirmNo() {
  showConfirm.value = false; // 취소 시 아무 것도 안 함
}
</script>
