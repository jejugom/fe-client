<template>
  <div class="flex flex-col gap-8">
    <!-- 배너 이미지 -->
    <img :src="AdBanner" alt="광고 배너" class="h-32 w-full object-cover" />

    <div>
      <div class="text-primary-300 text-2xl font-bold"> 전체 금융상품 </div>

      <!-- 필터 버튼 -->
      <div class="mt-2 flex justify-end gap-3">
        <TextBtn
          :color="sortBy === 'alphabet' ? 'primary' : 'surface'"
          label="가나다순"
          size="small"
          @click="sortBy = 'alphabet'"
        />
        <TextBtn
          :color="sortBy === 'default' ? 'primary' : 'surface'"
          label="맞춤순"
          size="small"
          @click="sortBy = 'default'"
        />
      </div>

      <!-- 리스트 -->
      <div class="mt-4 flex flex-col gap-4">
        <BtnCard
          v-for="item in sortedProducts"
          :key="item.productId"
          :title="item.productName"
          :content="item.description"
          btnText="자세히보기"
          color="primary"
          @click="goToProduct(item.productId)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import AdBanner from '@/assets/images/AdBanner.png';
import TextBtn from '@/components/buttons/TextBtn.vue';
import BtnCard from '@/components/cards/BtnCard.vue';
import { productsAll } from './_dummy';

const sortBy = ref<'default' | 'alphabet'>('default');

// 원본 데이터
const products = productsAll;

// 정렬된 리스트 반환
const sortedProducts = computed(() => {
  if (sortBy.value === 'alphabet') {
    return [...products].sort((a, b) =>
      a.productName.localeCompare(b.productName, 'ko-KR')
    );
  }
  return products;
});

// 클릭 시 라우팅 또는 이벤트 처리
const goToProduct = (productId: string) => {
  console.log('상품 선택됨:', productId);
  // router.push({ name: 'product-detail', params: { id: productId } });
};
</script>
