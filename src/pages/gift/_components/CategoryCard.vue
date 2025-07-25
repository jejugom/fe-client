<template>
  <div
    class="border-primary-300 flex flex-col items-center justify-center rounded-lg border py-2"
    @click="handleClick"
  >
    <img :src="getCategoryIcon(category)" class="h-12 w-12" />
    <div class="text-primary-500 my-2 font-semibold">{{ category }}</div>
    <Btn
      color="primary"
      :label="`${selectedCount} / ${totalCount}`"
      size="small"
    />
  </div>
</template>

<script setup lang="ts">
import Estate from '@/assets/images/Estate.svg';
import Deposits from '@/assets/images/Deposits.svg';
import Cash from '@/assets/images/Cash.svg';
import Stocks from '@/assets/images/Stocks.svg';
import Business from '@/assets/images/Business.svg';
import Etc from '@/assets/images/Etc.svg';
import Btn from '@/components/buttons/Btn.vue';

const categoryIcons: Record<string, string> = {
  부동산: Estate,
  예ㆍ적금: Deposits,
  현금: Cash,
  주식ㆍ펀드: Stocks,
  사업체ㆍ지분: Business,
  기타: Etc,
};

const getCategoryIcon = (category: string): string => {
  return categoryIcons[category] || Etc;
};

defineProps<{
  category: string;
  selectedCount: number;
  totalCount: number;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const handleClick = () => {
  emit('click');
};
</script>
