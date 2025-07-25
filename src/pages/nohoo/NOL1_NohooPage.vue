<template>
  <div class="flex flex-col gap-8">
    <!-- 탭 -->
    <TabBtnGroup
      :tabs="['맞춤', '예금', '적금', '주택담보']"
      v-model:selectedTab="selectedTab"
    />

    <!-- 조건부 컴포넌트 -->
    <div>
      <div v-if="selectedTab === '맞춤'">
        <AssetSummaryCard
          :userName="retirement.user_info.user_name"
          :assetAmount="retirement.user_info.asset_info.total"
          :assetInfo="retirement.user_info.asset_info"
        />
      </div>
      <div v-if="selectedTab === '예금' || selectedTab === '적금'">
        <div class="mb-2 flex items-end justify-between">
          <span class="text-primary-300 text-2xl font-bold"
            >금리 흐름을 확인하고<br />예금 똑똑하게 시작하세요</span
          >
          <span class="text-surface-300">출처: 한국은행</span>
        </div>
        <InterestRateCard :interestRateData="retirement['금리']"
      /></div>
      <Banner v-if="selectedTab === '주택담보'" />
    </div>

    <!-- 검색 -->
    <div class="flex w-full items-center gap-2">
      <InputBox
        placeholder="찾으시는 상품을 검색해보세요."
        size="large"
        type="text"
        v-model="searchKeyword"
      />
      <Btn color="primary" label="검색" size="square" @click="searchPlaces" />
    </div>

    <!-- 리스트 -->
    <div class="flex flex-col gap-4">
      <BtnCard
        v-for="product in filteredProducts"
        :key="product.id"
        btnText="자세히 보기"
        color="primary"
        :content="product.description"
        :tags="product.tags.join(' · ')"
        :title="product.name"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import TabBtnGroup from './_components/TabBtnGroup.vue';
import InputBox from '@/components/forms/InputBox.vue';
import Btn from '@/components/buttons/Btn.vue';
import BtnCard from '@/components/cards/BtnCard.vue';
import AssetSummaryCard from '@/components/cards/AssetSummaryCard.vue';
import Banner from '@/components/cards/Banner.vue';
import InterestRateCard from './_components/InterestRateCard.vue';
import { retirement } from './_dummy';

const selectedTab = ref('맞춤');

const searchKeyword = ref('');
const searchQuery = ref('');

const searchPlaces = () => {
  searchQuery.value = searchKeyword.value.trim();
};

// 예시 상품 데이터
const products = ref([
  {
    id: 1,
    category: '예금',
    name: 'KB Star 정기예금',
    description: '자동이체 등 우대조건 시 금리 우대 / 원금 보장',
    tags: ['1년만기', '우대금리'],
  },
  {
    id: 2,
    category: '적금',
    name: 'KB 스마트 적금',
    description: '자유적립식 / 모바일 전용 / 금리 우대 가능',
    tags: ['자유적립', '모바일'],
  },
  {
    id: 3,
    category: '주택담보',
    name: '주택담보대출 플랜',
    description: 'LTV/DTI 기준 내 담보대출 설계',
    tags: ['주택담보', '대출'],
  },
]);

// 필터링된 상품 목록
const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    const matchesCategory =
      selectedTab.value === '맞춤' || product.category === selectedTab.value;

    // 검색 쿼리는 searchQuery 기준으로만
    const matchesKeyword =
      searchQuery.value === '' ||
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase());

    return matchesCategory && matchesKeyword;
  });
});
</script>
