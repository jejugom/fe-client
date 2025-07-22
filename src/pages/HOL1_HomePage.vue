<template>
  <div class="space-y-6 bg-white px-4">
    <h2 class="mb-2 text-xl font-semibold text-blue-600">HOME</h2>
    <!-- 인사 및 자산 표시 -->
    <div class="my-5 rounded-lg border border-blue-200 p-4">
      <p class="text-base font-medium text-gray-700">
        <span class="font-bold text-blue-600">000님</span> 안녕하세요!
      </p>
      <p class="mt-1 text-lg font-semibold text-gray-900">
        내 자산<br />
        999,999,999,999원
      </p>
    </div>

    <!-- 자산 추가 버튼 -->
    <button
      class="w-full rounded-md bg-yellow-100 py-4 font-semibold text-gray-800"
      @click="goToEditAsset"
    >
      자산 추가 등록·수정
    </button>

    <!-- 맞춤형 서비스 -->
    <div>
      <h2 class="mb-3 text-lg font-semibold text-gray-800">맞춤형 서비스</h2>
      <div class="space-y-3">
        <div
          class="flex items-center rounded-lg border border-yellow-300 bg-yellow-50 p-8"
        >
          <img src="" alt="" class="mr-3 h-8 w-8" />
          <div @click="goToNohoo">
            <p class="text-xl font-semibold text-gray-800">노후준비</p>
            <p class="text-lg text-gray-600">연금부터 투자까지 맞춤 설계</p>
          </div>
        </div>
        <div
          class="flex items-center rounded-lg border border-yellow-300 bg-yellow-50 p-8"
        >
          <img src="" alt="" class="mr-3 h-8 w-8" />
          <div @click="goToGift">
            <p class="text-xl font-semibold text-gray-800">증여·상속</p>
            <p class="text-lg text-gray-600">세금 절감과 재산 이전 계획</p>
          </div>
        </div>
        <div
          class="flex items-center rounded-lg border border-yellow-300 bg-yellow-50 p-8"
        >
          <img src="" alt="" class="mr-3 h-8 w-8" />
          <div @click="goToEvent">
            <p class="text-xl font-semibold text-gray-800">건강관리</p>
            <p class="text-lg text-gray-600">의료비 준비부터 건강보험까지</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 금융상품 캐러셀 (Carousel 컴포넌트) -->
    <Top3Products :items="slides" />

    <!-- 광고배너 -->
    <Banner></Banner>

    <!-- 마무리 영역 -->
    <div
      class="items-center rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-center"
    >
      <p class="mb-2 p-4 text-2xl font-semibold text-blue-700"
        >노후도락과 함께 관리해요</p
      >
      <p class="p-4 text-sm text-gray-600">
        자산관리부터 맞춤형 상품까지<br />
        당신만을 위한 금융 솔루션
      </p>
      <div class="mt-3 flex justify-around p-4 text-sm text-gray-700">
        <div class="flex flex-col items-center">
          <img src="" class="mb-1 h-5 w-5" />
          간편한<br />모바일 사용
        </div>
        <div class="flex flex-col items-center">
          <img src="" class="mb-1 h-5 w-5" />
          안전한<br />금융 정보
        </div>
        <div class="flex flex-col items-center">
          <img src="" class="mb-1 h-5 w-5" />
          맞춤형<br />추천
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import Carousel from '@/components/carousel/Carousel.vue';
import Top3Products from '@/components/cards/Top3ProductsCard.vue';
import Banner from '@/components/cards/Banner.vue';

const router = useRouter();

const goToEditAsset = () => {
  router.push({ name: 'asset-edit-page' });
};

const goToEvent = () => {
  router.push({ name: 'event-page' });
};

const goToGift = () => {
  router.push({ name: 'gift-page' });
};

const goToNohoo = () => {
  router.push({ name: 'nohoo-page' });
};

const slides = [
  {
    title: '첫번째 맞춤형 금융상품',
    description:
      '• 설명1설명1설명1설명1\n• 설명1설명1설명1설명1\n• 설명1설명1설명1설명1',
  },
  {
    title: '두번째 맞춤형 금융상품',
    description:
      '• 설명2설명2설명2설명2\n• 설명2설명2설명2설명2\n• 설명2설명2설명2설명2',
  },
  {
    title: '세번째 맞춤형 금융상품',
    description:
      '• 설명3설명3설명3설명3\n• 설명3설명3설명3설명3\n• 설명3설명3설명3설명3',
  },
];
</script>
