<template>
  <button
    type="button"
    class="border-surface-300 flex h-13 w-74 items-center justify-between gap-1 rounded-lg border px-3 text-left text-base"
    @click="toggle"
  >
    <div class="w-40">{{ label }}</div>
    <div class="w-20">{{ amount }}</div>
    <img
      :src="isChecked ? Check : CheckNone"
      alt="check icon"
      class="h-7 w-7"
    />
  </button>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Check from '@/assets/icons/Check.svg';
import CheckNone from '@/assets/icons/CheckNone.svg';

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
</script>
