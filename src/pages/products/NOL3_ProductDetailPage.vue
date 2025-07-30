<template>
  <div class="flex flex-col gap-8">
    <!-- 상단 대표 정보 -->
    <DetailImg :items="topInfos" />

    <!-- 추천 이유 -->
    <div class="stroke-secondary flex flex-col gap-2 rounded-xl px-6 py-4">
      <span class="text-secondary-500 text-lg font-semibold">추천 이유</span>
      <span>{{ detail?.rec_reason || '추천 사유 없음' }}</span>
    </div>

    <!-- 상품 설명 -->
    <div class="mb-8">
      <p class="text-primary-300 mb-4 text-2xl font-bold">
        {{ detail?.fin_prdt_nm }}
      </p>
      <p class="indent-4 leading-relaxed whitespace-pre-line">
        {{ detail?.description }}
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
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  fetchProductDetail,
  type ProductDetail,
} from '@/api/products/productDetail';

import DetailImg from './_components/DetailImg.vue';
import Btn from '@/components/buttons/Btn.vue';
import { useRegisterStore } from '@/stores/register';

// 라우트에서 id 추출
const route = useRoute();
const router = useRouter();

const registerStore = useRegisterStore();

const detail = ref<ProductDetail | null>(null);

// 실제 토큰을 여기에 삽입하거나 상태에서 가져오기
const token = import.meta.env.VITE_ACCESS_TOKEN;

onMounted(async () => {
  const id = route.params.id as string;
  if (!id) return;
  try {
    const result = await fetchProductDetail(id, token);
    detail.value = result;
  } catch (e) {
    console.error('상품 상세 조회 실패', e);
  }
});

const goToRegister = () => {
  if (!detail.value) return;
  registerStore.setProductName(detail.value.fin_prdt_nm);
  router.push({ name: 'register', params: { id: detail.value.fin_prdt_cd } });
};

// 상단 대표 정보 생성
const topInfos = computed(() => {
  if (!detail.value) return [];
  const icon = detail.value.icon_info || {};
  switch (detail.value.fin_prdt_category) {
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
});
</script>
