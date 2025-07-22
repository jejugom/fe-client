<template>
  <div
    class="bg-primary-100 flex h-50 w-full items-center justify-center gap-8 p-8"
  >
    <div
      v-for="(item, idx) in items"
      :key="idx"
      class="flex w-24 flex-col items-center justify-between"
    >
      <img
        v-if="getIcon(item.label)"
        :src="getIcon(item.label)"
        alt="icon"
        class="h-20 w-20"
      />
      <span class="text-surface-300 mt-1 mb-2 text-base font-semibold">{{
        item.label
      }}</span>
      <span class="font-hakgyo text-primary-500 text-center text-lg">
        {{ item.value }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon1 from '@/assets/icons/Product.svg';
import Icon2 from '@/assets/icons/Product.svg';
import Icon3 from '@/assets/icons/Product.svg';
import Icon4 from '@/assets/icons/Product.svg';

defineProps<{
  items: { label: string; value: string }[];
}>();

// 라벨 기반 아이콘 반환 함수
const getIcon = (label: string): string | null => {
  if (label.endsWith('금리')) return Icon1;
  if (label === '가입방법') return Icon2;
  if (label === '연금저축유형') return Icon3;
  if (label === '담보인정비율') return Icon4;
  return null;
};
</script>
