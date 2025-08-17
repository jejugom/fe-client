<template>
  <div>
    <div v-if="selectedTab === '맞춤'">
      <AssetSummaryCardBar
        :userName="userName"
        :assetAmount="assetAmount"
        :assetInfo="assetSummary"
      />
    </div>

    <div v-if="selectedTab === '예금'">
      <div class="mb-2 flex items-end justify-between">
        <span class="text-primary-500 text-2xl font-bold"> 오늘의 금리 </span>
        <span class="text-surface-300">출처: 한국은행</span>
      </div>
      <InterestRateCard :interestRateData="graphStore.interestRate" />
    </div>

    <div v-if="selectedTab === '적금'">
      <div v-if="news.length > 0">
        <NewsCard :newsItem="news[0]" />
      </div>
      <Banner v-else />
    </div>

    <div v-if="selectedTab === '주택담보'">
      <div v-if="news.length > 0">
        <NewsCard :newsItem="news[0]" />
      </div>
      <Banner v-else />
    </div>

    <div v-if="selectedTab === '금'">
      <div
        class="text-primary-500 mb-4 flex items-center justify-between text-2xl font-bold"
      >
        오늘의 금값
        <span class="text-surface-300 font-regular text-base">출처: FX</span>
      </div>
      <GoldPriceCard class="mb-8" />
      <Banner />
    </div>

    <div v-if="selectedTab === '펀드'">
      <div v-if="news.length > 0">
        <NewsCard :newsItem="news[0]" />
      </div>
      <Banner v-else />
    </div>

    <div v-if="selectedTab === '신탁'">
      <div v-if="news.length > 0">
        <NewsCard :newsItem="news[0]" />
      </div>
      <Banner v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useGraphStore } from '@/stores/interestRate';
import type { News } from '@/types/nohoo/nohoo';

const AssetSummaryCardBar = defineAsyncComponent(
  () => import('@/components/cards/AssetSummaryCardBar.vue')
);
const Banner = defineAsyncComponent(
  () => import('@/components/cards/Banner.vue')
);
const InterestRateCard = defineAsyncComponent(
  () => import('./InterestRateCard.vue')
);
const GoldPriceCard = defineAsyncComponent(() => import('./GoldPriceCard.vue'));
const NewsCard = defineAsyncComponent(
  () => import('@/components/cards/NewsCard.vue')
);

const graphStore = useGraphStore();

defineProps<{
  selectedTab: string;
  userName: string;
  assetAmount: number;
  assetSummary: { category: string; amount: number }[];
  news: News[];
}>();
</script>
