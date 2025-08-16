<template>
  <input
    :type="type"
    :class="[
      'border-surface-300 input-focus focus:ring-gold focus:border-gold rounded-lg border bg-white px-3 text-base focus:ring-1 focus:outline-none',
      size === 'large' && 'h-13 w-full',
      size === 'medium' && 'h-13 w-68',
      size === 'small' && 'h-10 w-25',
      $attrs.class,
    ]"
    v-bind="$attrs"
    :value="modelValue"
    :placeholder="placeholder"
    @input="
      $emit(
        'update:modelValue',
        ($event.target as HTMLInputElement)?.value ?? ''
      )
    "
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: string;
  type?: 'text' | 'password' | 'number' | 'date' | 'time';
  size?: 'small' | 'medium' | 'large';
  placeholder?: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<style scoped>
/* 날짜 및 시간 입력 필드 스타일 초기화 */
input[type='date'],
input[type='time'] {
  -webkit-appearance: none;
  appearance: none;
  background-color: transparent;
}
</style>
