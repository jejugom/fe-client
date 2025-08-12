<template>
  <select
    :class="[
      'active:ring-gold active:border-gold border-surface-300 rounded-lg border bg-white px-4 text-base active:ring-1 active:outline-none',
      size === 'large' && 'h-13 w-82.5',
      size === 'medium' && 'h-13 w-68',
      size === 'small' && 'h-10 w-25',
      $attrs.class,
    ]"
    v-bind="$attrs"
    :value="modelValue"
    @change="handleChange"
  >
    <slot />
  </select>
</template>

<script setup lang="ts" generic="T extends string | number | boolean">
import { defineProps, defineEmits, withDefaults } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue?: T;
    size?: 'small' | 'medium' | 'large';
  }>(),
  {
    modelValue: undefined,
    size: 'medium',
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: T): void;
}>();

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  let value: string | number | boolean = target.value;

  // `value`의 실제 타입에 따라 적절한 값으로 변환
  if (value === 'true') {
    value = true;
  } else if (value === 'false') {
    value = false;
  } else if (!isNaN(Number(value)) && value !== '') {
    value = Number(value);
  }

  // 변환된 값을 T 타입으로 캐스팅하여 emit
  emit('update:modelValue', value as T);
};
</script>
