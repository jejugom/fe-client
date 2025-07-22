<template>
  <div class="space-y-6 bg-white px-4">
    <h2 class="mb-2 text-xl font-semibold text-blue-600">노후 페이지</h2>
    <!-- <AssetSummary userName="홍길동" assetAmount="9,999,999,999,999" /> -->
    <Top3Products :items="slides" />
    <button
      class="mx-auto block w-full rounded-lg bg-blue-100 py-4 text-lg font-semibold text-gray-800 hover:bg-blue-200"
      @click="goToPersonalizedProducts"
    >
      개인맞춤 상품 더 보러가기
    </button>
    <button
      class="mx-auto block w-full rounded-lg bg-yellow-100 py-4 text-lg font-semibold text-gray-800 hover:bg-yellow-200"
      @click="goToAllProducts"
    >
      전체 상품 보러가기
    </button>
    <InterestRate></InterestRate>
    <GoldPrice></GoldPrice>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AssetSummary from '@/components/cards/AssetSummaryCard.vue'; // 상대 경로에 맞게
import Top3Products from '@/components/cards/Top3ProductsCard.vue';
import GoldPrice from '@/components/cards/GoldPriceCard.vue';
import InterestRate from '@/components/cards/InterestRateCard.vue';

const router = useRouter();

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

const goToAllProducts = () => {
  router.push('/nohoo/products');
};

const goToPersonalizedProducts = () => {
  router.push('/nohoo/products/personalized');
};
</script>

<style scoped></style>
