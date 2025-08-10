<template>
  <button
    type="button"
    class="flex h-15 w-full items-center justify-between gap-1 rounded-lg px-3 text-left text-base"
    @click="toggle"
  >
    <div class="flex flex-col">
      <div class="text-surface-500 text-base">{{ label }}</div>
      <div class="text-surface-300 text-base">{{ formattedAmount }}</div>
    </div>
    <img
      :src="isChecked ? Check : CheckNone"
      alt="check icon"
      class="btn-pressed h-7 w-7"
    />
  </button>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import Check from '@/assets/icons/Check.svg';
import CheckNone from '@/assets/icons/CheckNone.svg';
import { formatCurrency } from '@/utils/format';

const props = defineProps<{
  modelValue: boolean;
  label: string;
  amount: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const isChecked = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newVal) => {
    isChecked.value = newVal;
  }
);

const toggle = () => {
  isChecked.value = !isChecked.value;
  emit('update:modelValue', isChecked.value);
};

// 금액을 만원/억원 형식으로 포맷팅
const formattedAmount = computed(() => {
  // props.amount를 Number()로 변환하여 formatCurrency에 전달
  return formatCurrency(Number(props.amount));
});
</script>
