<template>
  <div class="flex flex-col gap-8">
    <!-- 탭 -->
    <TabBtnGroup
      :tabs="['맞춤', '예금', '적금', '주택담보', '금']"
      v-model:selectedTab="selectedTab"
    />

    <!-- 조건부 컴포넌트 -->
    <AdBox :selectedTab="selectedTab" />

    <!-- 리스트 -->
    <div class="flex flex-col gap-4">
      <div
        v-if="filteredProducts.length === 0"
        class="text-surface-400 text-center text-base"
      >
        조건에 맞는 상품이 없습니다.
      </div>
      <BtnCard
        v-for="product in filteredProducts"
        :key="product.id"
        btnText="자세히 보기"
        color="primary"
        :content="product.description"
        :tags="product.tags.join(' · ')"
        :title="product.name"
        @click="goToDetail(product.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import TabBtnGroup from './_components/TabBtnGroup.vue';
import BtnCard from '@/components/cards/BtnCard.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
import AdBox from './_components/AdBox.vue';

const selectedTab = ref('맞춤');
const searchKeyword = ref('');
const searchQuery = ref('');

// 탭이 바뀌면 검색어 초기화
watch(selectedTab, () => {
  searchKeyword.value = '';
  searchQuery.value = '';
});

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
  // 1. 먼저 카테고리 필터링
  const categoryFiltered = products.value.filter((product) => {
    return (
      selectedTab.value === '맞춤' || product.category === selectedTab.value
    );
  });

  // 2. 그 후 검색어 필터링
  if (searchQuery.value.trim() === '') return categoryFiltered;

  return categoryFiltered.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const goToDetail = (productId: number) => {
  if (!productId) return;
  router.push({ name: 'product-detail', params: { id: productId } });
};
</script>
