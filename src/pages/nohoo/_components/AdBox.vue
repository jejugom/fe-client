<template>
  <div>
    <div v-if="selectedTab === '맞춤'">
      <AssetSummaryCardBar
        :userName="userName"
        :assetAmount="assetAmount"
        :assetInfo="assetSummary"
      />
    </div>

    <div v-if="selectedTab === '예금' || selectedTab === '적금'">
      <div class="mb-2 flex items-end justify-between">
        <span class="text-primary-300 text-2xl font-bold">
          금리 흐름을 확인하고<br />더 나은 예금 상품을 골라보세요!
        </span>
        <span class="text-surface-300">출처: 한국은행</span>
      </div>
      <InterestRateCard :interestRateData="graphStore.interestRate" />
    </div>

    <Banner v-if="selectedTab === '주택담보'" />

    <div v-if="selectedTab === '금'">
      <div
        class="text-primary-300 mb-4 flex items-center justify-between text-2xl font-bold"
      >
        오늘의 금값
        <span class="text-surface-300 font-regular text-sm">출처: FX</span>
      </div>
      <GoldPriceCard class="mb-8" />
      <img :src="Gold" alt="Gold Banner" />
    </div>
  </div>
</template>

<script setup lang="ts">
import AssetSummaryCardBar from '@/components/cards/AssetSummaryCardBar.vue';
import Banner from '@/components/cards/Banner.vue';
import InterestRateCard from './InterestRateCard.vue';
import GoldPriceCard from './GoldPriceCard.vue';
import { useGraphStore } from '@/stores/interestRate';
import Gold from '@/assets/images/goldBanner.png';

defineProps<{
  selectedTab: string;
  userName: string;
  assetAmount: number;
  assetInfo: {
    assetId: number;
    email: string;
    assetCategoryCode: string;
    amount: number;
    assetName: string;
    businessType: string | null;
  }[];
  assetSummary: { category: string; amount: number }[];
}>();

const graphStore = useGraphStore();
</script>
