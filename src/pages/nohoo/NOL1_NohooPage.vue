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
        찾으신 조건으로는 상품이 아직 준비 중이에요!<br />조건을 조금
        바꿔보시겠어요?
      </div>
      <div
        v-if="selectedTab === '맞춤'"
        class="text-primary-300 text-2xl font-semibold"
      >
        최승아님께 딱 맞는 상품만 보여드릴게요
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
import AdBox from './_components/AdBox.vue';
import { useRouter } from 'vue-router';
import { productData } from './_dummy';

const selectedTab = ref('맞춤');
const searchKeyword = ref('');
const searchQuery = ref('');
const router = useRouter();

watch(selectedTab, () => {
  searchKeyword.value = '';
  searchQuery.value = '';
});

const allProducts = computed(() => {
  let idCounter = 1;
  const flatList = [];

  // 예금
  productData.timeDeposits.forEach((item) => {
    item.optionList.forEach((opt) => {
      flatList.push({
        id: idCounter++,
        category: '예금',
        name: item.fin_prdt_nm,
        description: item.prdt_feature,
        tags: [
          `${opt.save_trm}개월`,
          `기본 ${opt.intr_rate}%`,
          `우대 ${opt.intr_rate2}%`,
        ],
      });
    });
  });

  // 적금
  productData.savingDeposits.forEach((item) => {
    item.optionList.forEach((opt) => {
      flatList.push({
        id: idCounter++,
        category: '적금',
        name: item.fin_prdt_nm,
        description: item.prdt_feature,
        tags: [
          `${opt.save_trm}개월`,
          `기본 ${opt.intr_rate}%`,
          `우대 ${opt.intr_rate2}%`,
        ],
      });
    });
  });

  // 주택담보대출
  productData.mortgageLoan.forEach((item) => {
    item.optionListList.forEach((opt) => {
      flatList.push({
        id: idCounter++,
        category: '주택담보',
        name: item.fin_prdt_nm,
        description: item.prdt_feature,
        tags: [
          opt.mrtg_type_nm,
          opt.rpay_type_nm,
          `${opt.lend_rate_min}% ~ ${opt.lend_rate_max}%`,
        ],
      });
    });
  });

  return flatList;
});

const filteredProducts = computed(() => {
  const categoryFiltered = allProducts.value.filter((product) => {
    return (
      selectedTab.value === '맞춤' || product.category === selectedTab.value
    );
  });

  if (searchQuery.value.trim() === '') return categoryFiltered;

  return categoryFiltered.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const goToDetail = (productId: number) => {
  router.push({ name: 'product-detail', params: { id: productId } });
};
</script>
