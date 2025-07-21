<template>
  <div class="space-y-3">
    <CheckBox
      v-for="option in options"
      :key="option.amount"
      :label="option.label"
      :amount="option.amount"
      :modelValue="checkedValues.includes(option.amount)"
      @update:modelValue="(checked) => onCheck(option.amount, checked)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import CheckBox from './CheckBox.vue';

const props = defineProps<{
  options: { label: string; amount: string }[];
  modelValue: string[]; // 선택된 amount 리스트
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
}>();

const checkedValues = ref<string[]>([...props.modelValue]);

watch(
  () => props.modelValue,
  (newVal) => {
    checkedValues.value = [...newVal];
  }
);

const onCheck = (amount: string, checked: boolean) => {
  if (checked) {
    checkedValues.value.push(amount);
  } else {
    checkedValues.value = checkedValues.value.filter((v) => v !== amount);
  }
  emit('update:modelValue', checkedValues.value);
};
</script>
