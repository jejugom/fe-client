<template>
  <!-- 인사 및 자산 표시 -->
  <div class="border-primary-300 mb-2 rounded-xl border bg-white p-4">
    <div class="text-primary-300 mb-4 text-lg font-semibold">
      {{ userName }}님 <span class="text-surface-500">안녕하세요!</span>
    </div>
    <div class="space-y-1">
      <p class="text-surface-300 font-semibold">내 자산</p>
      <p class="text-surface-500 font-semibold">
        {{ formatCurrency(totalAsset) }}
      </p>
    </div>
  </div>

  <!-- 자산 추가 버튼 -->
  <Btn
    class="mb-8"
    color="secondary"
    label="자산 추가 등록·수정"
    size="large"
    @click="goToEditAsset"
  />

  <!-- 맞춤형 서비스 카드 -->
  <section class="mb-16">
    <h2 class="text-primary-300 mb-4 text-2xl font-bold"
      >지금 필요한 것만, 딱 맞게 준비해요</h2
    >
    <div class="space-y-4">
      <IconCard
        v-for="(card, index) in serviceCards"
        :key="index"
        :title="card.title"
        :content1="card.content1"
        :content2="card.content2"
        color="secondary"
        class="border-secondary-300 border shadow-none"
        @click="handlers[card.onClick]"
      >
        <template #icon>
          <img :src="card.src" />
        </template>
      </IconCard>
    </div>
  </section>

  <!-- 금융상품 캐러셀 -->
  <section class="mb-16">
    <h2 class="text-primary-300 mb-4 text-2xl font-bold">
      내가 쓸 돈, 미리 챙겨두는 3가지 방법
    </h2>
    <Top3Products :items="slides" />
  </section>

  <!-- 광고 배너 -->
  <img :src="AdBanner" alt="광고 배너" class="mb-16 h-30 w-full object-cover" />

  <!-- 하단 서비스 특징 -->
  <section class="border-secondary-300 rounded-xl border p-4 text-center">
    <div class="mb-4 p-4">
      <p class="text-primary-300 mb-4 text-2xl font-semibold"
        >노후도락과 함께 챙겨드립니다</p
      >
      <p class="text-surface-400 text-base">
        자산은 얼마나 있는지, 어떤 상품이 나에게 좋은지<br />
        이제 복잡하지 않게 하나씩 알려드릴게요
      </p>
    </div>

    <div class="flex justify-around">
      <div
        v-for="(feature, index) in features"
        :key="index"
        class="flex h-38 w-28 flex-col items-center justify-center"
      >
        <img :src="feature.src" class="mb-2 h-16 w-16" />
        <div class="flex flex-col items-center text-center">
          <div>
            <span class="text-secondary-300 font-semibold">{{
              feature.keyword
            }}</span
            >{{ feature.suffix }}
          </div>
          <div>{{ feature.description }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import Top3Products from '@/components/cards/Top3ProductsCard.vue';
import Btn from '@/components/buttons/Btn.vue';
import { retirement } from './nohoo/_dummy';
import IconCard from '@/components/cards/IconCard.vue';
import AdBanner from '@/assets/images/AdBanner.png';
import Home1 from '@/assets/images/Home1.svg';
import Home2 from '@/assets/images/Home2.svg';
import Home3 from '@/assets/images/Home3.svg';
import Home4 from '@/assets/images/Home4.svg';
import Home5 from '@/assets/images/Home5.svg';
import Home6 from '@/assets/images/Home6.svg';

const router = useRouter();

const userName = retirement.user_info.user_name;
const totalAsset = retirement.user_info.asset_info.total;

// 금액 포맷 함수
const formatCurrency = (value: number): string => {
  return value.toLocaleString('ko-KR') + '원';
};

// 맞춤형 서비스 카드
const serviceCards = [
  {
    title: '노후준비',
    content1: '내가 쓸 돈, 내가 준비해요',
    content2: '연금부터 여유자금까지 차근차근 모아드려요',
    onClick: 'goToNohoo',
    src: Home1,
  },
  {
    title: '증여·상속',
    content1: '내가 원할 때, 원하는 만큼',
    content2: '가족에게 남기는 마음을 함께 설계해요',
    src: Home2,
    onClick: 'goToGift',
  },
  {
    title: '건강관리',
    content1: '아프면 돈이 더 들어요',
    content2: '지금부터 차근차근 챙겨요',
    onClick: 'goToEvent',
    src: Home3,
  },
];

const handlers: Record<string, () => void> = {
  goToNohoo: () => {
    router.push({ name: 'nohoo' });
  },
  goToGift: () => {
    router.push({ name: 'gift' });
  },
  goToEvent: () => {
    router.push({ name: 'event' });
  },
};

const goToEditAsset = () => {
  router.push({ name: 'edit-asset' });
};

// 맞춤형 금융상품
const slides = [
  {
    prod_name: '첫번째 맞춤형 금융상품',
    description:
      '• 설명1설명1설명1설명1\n• 설명1설명1설명1설명1\n• 설명1설명1설명1설명1',
    rate: 0,
  },
  {
    prod_name: '두번째 맞춤형 금융상품',
    description:
      '• 설명2설명2설명2설명2\n• 설명2설명2설명2설명2\n• 설명2설명2설명2설명2',
    rate: 0,
  },
  {
    prod_name: '세번째 맞춤형 금융상품',
    description:
      '• 설명3설명3설명3설명3\n• 설명3설명3설명3설명3\n• 설명3설명3설명3설명3',
    rate: 0,
  },
];

// 하단 노후도락 설명
const features = [
  {
    image: '',
    keyword: '',
    suffix: '누르기만',
    description: '하면 끝!',
    src: Home4,
  },
  {
    image: '',
    keyword: '',
    suffix: '믿을 수 있는',
    description: '정보만',
    src: Home5,
  },
  {
    image: '',
    keyword: '',
    suffix: '나한테',
    description: '딱 맞는 상품',
    src: Home6,
  },
];
</script>
