<template>
  <div
    class="bg-secondary-100 flex h-50 w-full items-center justify-center gap-8 p-8"
  >
    <div
      v-for="(item, idx) in items"
      :key="idx"
      class="flex w-24 flex-col items-center justify-between"
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
      <span class="font-hakgyo text-primary-500 text-center">
        {{ item.value }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import InterestRate from '@/assets/icons/InterestRate.svg';
import LoanRate from '@/assets/icons/LoanRate.svg';
import CollateralOil from '@/assets/icons/CollateralOil.svg';
import SignUpRoom from '@/assets/icons/SignUpRoom.svg';
import SubscriptionRestriction from '@/assets/icons/SubscriptionRestriction.svg';
import MothReturn from '@/assets/icons/3MonthReturn.svg';
import Currency from '@/assets/icons/Currency.svg';
import RateType from '@/assets/icons/RateType.svg';
import UnitOfAccount from '@/assets/icons/UnitOfAccount.svg';

defineProps<{
  items: { label: string; value: string }[];
}>();

// 라벨 기반 아이콘 반환 함수
const getIcon = (label: string): string | null => {
  if (label.includes('최고금리')) return InterestRate;
  if (label.includes('가입방법')) return SignUpRoom;
  if (label.includes('담보유형')) return CollateralOil;
  if (label.includes('가입제한')) return SubscriptionRestriction;
  if (label.includes('대출금리')) return LoanRate;
  if (label.includes('3개월 수익률')) return MothReturn;
  if (label.includes('통화')) return Currency;
  if (label.includes('금리유형')) return RateType;
  if (label.includes('매매단위')) return UnitOfAccount;
  if (label.includes('총보수')) return LoanRate;
  if (label.includes('위험등급')) return SubscriptionRestriction;
  return null;
};
</script>
