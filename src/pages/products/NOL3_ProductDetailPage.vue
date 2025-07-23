<template>
  <div class="flex flex-col gap-8">
    <!-- 상단 대표 정보 -->
    <DetailImg :items="topInfos" />

    <!-- 추천 이유 -->
    <div class="stroke-secondary flex flex-col gap-2 rounded-xl px-6 py-4">
      <span class="text-secondary-500 text-lg font-semibold">추천이유</span>
      <span>{{ detail?.recommendReason }}</span>
    </div>

    <!-- 상품 설명 -->
    <div>
      <p class="text-primary-300 mb-4 text-2xl font-bold">
        {{ detail?.productName }}
      </p>
      <p class="indent-4 leading-relaxed whitespace-pre-line">
        {{ detail?.description }}
      </p>
    </div>

    <!-- 가입 예약 버튼 -->
    <div
      class="fixed bottom-[calc(5rem+1rem)] left-1/2 box-border w-full max-w-150 -translate-x-1/2 px-5"
    >
      <Btn
        color="primary"
        label="가입 예약하기"
        size="large"
        @click="goToRegister"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { productDetail } from './_dummy';
import DetailImg from './_components/DetailImg.vue';
import Btn from '@/components/buttons/Btn.vue';

const router = useRouter();
const detail = productDetail;

// 타입별 상단 정보 정의
const topInfos =
  detail?.productType === '1'
    ? [
        { label: '금리', value: detail.iconInfo?.금리 },
        { label: '가입방법', value: detail.iconInfo?.가입방법 },
      ]
    : detail?.productType === '2'
      ? [
          { label: '금리', value: detail.iconInfo?.금리 },
          { label: '가입방법', value: detail.iconInfo?.가입방법 },
        ]
      : detail?.productType === '3'
        ? [
            { label: '연금저축유형', value: detail.iconInfo?.연금저축유형 },
            { label: '저축금리', value: detail.iconInfo?.저축금리 },
            { label: '가입방법', value: detail.iconInfo?.가입방법 },
          ]
        : detail?.productType === '4'
          ? [
              { label: '담보인정비율', value: detail.iconInfo?.담보인정비율 },
              { label: '대출금리', value: detail.iconInfo?.대출금리 },
              { label: '가입방법', value: detail.iconInfo?.가입방법 },
            ]
          : [];

const goToRegister = () => {
  router.push({
    name: 'register',
    params: { id: detail?.productId },
  });
};
</script>
