<template>
  <select
    :class="[
      'border-surface-300 rounded-lg border px-3 text-base',
      size === 'large' && 'h-13 w-82.5',
      size === 'medium' && 'h-13 w-68',
      size === 'small' && 'h-10 w-25',
      $attrs.class,
    ]"
    v-bind="$attrs"
    :value="modelValue"
    @change="
      $emit('update:modelValue', ($event.target as HTMLSelectElement).value)
    "
  >
    <slot />
  </select>
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: string;
  size?: 'small' | 'medium' | 'large';
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>
