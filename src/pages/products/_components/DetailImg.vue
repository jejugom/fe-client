<template>
  <div
    class="relative left-1/2 mt-[-1.125rem] w-screen max-w-150 -translate-x-1/2"
  >
    <div
      class="bg-secondary-100 flex h-50 w-full items-center justify-center gap-8 p-8"
    >
      <div
        v-for="(item, idx) in items"
        :key="idx"
        class="flex w-32 flex-col items-center justify-between"
      >
        <img
          v-if="getIcon(item.label)"
          :src="getIcon(item.label) ?? undefined"
          alt="icon"
          class="h-20 w-20"
        />
        <span class="text-surface-300 mt-1 mb-2 text-base font-semibold">{{
          item.label
        }}</span>
        <span class="font-point text-primary-500 text-center">
          {{ item.value }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon1 from '@/assets/images/productFeats/Icon 1.svg';
import Icon2 from '@/assets/images/productFeats/Icon 2.svg';
import Icon3 from '@/assets/images/productFeats/Icon 3.svg';
import Icon4 from '@/assets/images/productFeats/Icon 4.svg';
import Icon5 from '@/assets/images/productFeats/Icon 5.svg';
import Icon6 from '@/assets/images/productFeats/Icon 6.svg';
import Icon7 from '@/assets/images/productFeats/Icon 7.svg';
import Icon8 from '@/assets/images/productFeats/Icon 8.svg';
import Icon9 from '@/assets/images/productFeats/Icon 9.svg';
import Icon10 from '@/assets/images/productFeats/Icon 10.svg';
import Icon11 from '@/assets/images/productFeats/Icon 11.svg';
import Icon12 from '@/assets/images/productFeats/Icon 12.svg';
import Icon13 from '@/assets/images/productFeats/Icon 13.svg';

defineProps<{
  items: { label: string; value: string }[];
}>();

// 라벨 기반 아이콘 반환 함수
const getIcon = (label: string): string | null => {
  if (label.includes('최고금리')) return Icon1;
  if (label.includes('가입방법')) return Icon2;
  if (label.includes('가입제한')) return Icon3;
  if (label.includes('대출금리')) return Icon4;
  if (label.includes('담보유형')) return Icon5;
  if (label.includes('금리유형')) return Icon6;
  if (label.includes('매매단위')) return Icon7;
  if (label.includes('통화')) return Icon8;
  if (label.includes('3개월 수익률')) return Icon9;
  if (label.includes('위험등급')) return Icon10;
  if (label.includes('총보수')) return Icon11;
  if (label.includes('보호여부')) return Icon12;
  if (label.includes('기준가')) return Icon13;
  return null; // 기본값
};
</script>
