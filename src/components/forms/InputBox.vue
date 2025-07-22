<template>
  <input
    :type="type"
    :class="[
      'border-surface-300 rounded-lg border px-3 text-base',
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
  type?: 'text' | 'password' | 'number';
  size?: 'small' | 'medium' | 'large';
  placeholder?: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>
