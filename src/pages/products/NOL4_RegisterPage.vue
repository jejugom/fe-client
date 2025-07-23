<template>
  <div class="flex flex-col gap-8">
    <!-- 상단 대표 정보 -->
    <DetailImg :items="topInfos" />

    <div class="flex flex-col gap-4">
      <ReserveInputBox
        title="상품 및 상담"
        type="text"
        placeholder="지점 선택"
        :readOnly="true"
        v-model="modelValue"
      />
      <ReserveInputBox
        title="방문할 지점"
        explain="지점 변경하시려면 눌러주세요"
        type="text"
        placeholder="지점 선택"
        :readOnly="true"
        v-model="branchValue"
      />
      <ReserveInputBox
        title="방문 날짜"
        type="date"
        placeholder="날짜를 선택하세요"
        v-model="dateValue"
      />
      <ReserveInputBox
        title="방문 시각"
        type="time"
        placeholder="시각을 선택하세요"
        v-model="timeValue"
      />
    </div>

    <!-- 가입 예약 버튼 -->
    <!-- <div
      class="fixed bottom-[calc(5rem+2rem)] left-1/2 box-border w-full max-w-150 -translate-x-1/2 px-5"
    > -->
    <Btn
      color="primary"
      label="가입 예약하기"
      size="large"
      @click="goToRegister"
    />
    <!-- </div> -->

    <!-- 버튼 높이만큼 공간 확보
    <div class="h-20"></div> -->
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { productDetail } from './_dummy';
import DetailImg from './_components/DetailImg.vue';
import Btn from '@/components/buttons/Btn.vue';
import ReserveInputBox from './_components/ReserveInputBox.vue';

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

const modelValue = ref(detail?.productName || '');
const branchValue = ref('국민은행 세종대점');
const dateValue = ref('');
const timeValue = ref('');

const goToRegister = () => {
  router.push({
    name: 'register-complete',
  });
};
</script>
