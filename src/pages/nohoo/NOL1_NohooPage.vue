<template>
  <div class="text-primary-300 mb-2 text-2xl font-bold">노후</div>
  <div class="flex flex-col gap-16">
    <!-- 자산현황 -->
    <AssetSummaryCard
      :userName="retirement.user_info.user_name"
      :assetAmount="retirement.user_info.asset_info.total"
      :assetInfo="retirement.user_info.asset_info"
    />
    <!-- 든든한 노후를 위한 금융상품 3선 -->
    <div>
      <div class="text-primary-300 mb-2 text-2xl font-bold">
        든든한 노후를 위한 금융상품 3선
      </div>
      <Top3ProductsCard :items="retirement.prod_top3" class="mt-2" />
      <Btn
        color="primary"
        label="개인맞춤 상품 더 보러가기"
        size="large"
        class="my-4"
        @click="goToPersonalizedProducts"
      />
      <Btn
        color="secondary"
        label="전체상품 보러가기"
        size="large"
        @click="goToAllProducts"
      />
    </div>
    <!-- 오늘의 금리 -->
    <div>
      <div
        class="text-primary-300 mb-4 flex items-center justify-between text-2xl font-bold"
      >
        오늘의 금리
        <span class="text-surface-300 font-regular text-sm">한국은행</span>
      </div>
      <InterestRateCard :interestRateData="retirement['금리']" />
    </div>
    <!-- 오늘의 금 시세 -->
    <div>
      <div
        class="text-primary-300 mb-4 flex items-center justify-between text-2xl font-bold"
      >
        오늘의 금 시세
        <span class="text-surface-300 font-regular text-sm">한국거래소</span>
      </div>
      <GoldPriceCard :goldPriceData="retirement['금시세']" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import AssetSummaryCard from '@/components/cards/AssetSummaryCard.vue';
import Top3ProductsCard from '@/components/cards/Top3ProductsCard.vue';
import GoldPriceCard from './_components/GoldPriceCard.vue';
import InterestRateCard from './_components/InterestRateCard.vue';
import Btn from '@/components/buttons/Btn.vue';
import { retirement } from './_dummy';

const router = useRouter();

const goToAllProducts = () => {
  router.push({ name: 'all-products' });
};

const goToPersonalizedProducts = () => {
  router.push({ name: 'personalized-product' });
};
</script>

<style scoped></style>
