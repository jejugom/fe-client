<template>
  <div class="flex flex-col gap-8">
    <!-- 상단 대표 정보 -->
    <DetailImg :items="topInfos" />

    <!-- 추천 이유 -->
    <div class="stroke-secondary flex flex-col gap-2 rounded-xl px-6 py-4">
      <span class="text-secondary-500 text-lg font-semibold">추천 이유</span>
      <span>{{ detail.recReason }}</span>
    </div>

    <!-- 상품 설명 -->
    <div class="mb-8">
      <p class="text-primary-300 mb-4 text-2xl font-bold">
        {{ detail.finPrdtNm }}
      </p>
      <p class="indent-4 leading-relaxed whitespace-pre-line">
        {{ detail.description }}
      </p>
    </div>

    <!-- 가입 예약 버튼 -->
    <div>
      <p class="text-primary-300 mb-2 text-center font-semibold">
        은행에서 상담받고 가입하실 수 있어요
      </p>
      <Btn
        color="primary"
        label="상담 예약하기"
        size="large"
        @click="goToRegister"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { api_data } from '@/api/products/productDetail';
import type { ProductDetail } from '@/api/products/productDetail';
import DetailImg from './_components/DetailImg.vue';
import Btn from '@/components/buttons/Btn.vue';
import { useRegisterStore } from '@/stores/register';

const router = useRouter();
const detail: ProductDetail = api_data;
const registerStore = useRegisterStore();

// 상단 대표 정보 생성
const topInfos = (() => {
  const icon = detail.iconInfo || {};
  switch (detail.finPrdtCategory) {
    case '1':
    case '2':
      return [
        { label: '금리', value: icon['금리'] ?? '' },
        { label: '가입방법', value: icon['가입방법'] ?? '' },
        { label: '가입제한', value: icon['가입제한'] ?? '' },
      ];
    case '3':
      return [
        { label: '담보유형', value: icon['담보유형'] ?? '' },
        { label: '대출금리', value: icon['대출금리'] ?? '' },
        { label: '가입방법', value: icon['가입방법'] ?? '' },
      ];
    default:
      return [];
  }
})();

const goToRegister = () => {
  registerStore.setProductName(detail.finPrdtNm);
  router.push({
    name: 'register',
    params: { id: detail.finPrdtCd },
  });
};
</script>
