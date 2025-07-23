<template>
  <div>
    <div class="mb-2 flex items-end justify-between">
      <span class="text-primary-300 text-lg font-semibold">{{ title }}</span>
      <span v-if="explain" class="text-surface-300">{{ explain }}</span>
    </div>
    <InputBox
      :modelValue="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      :placeholder="placeholder"
      size="large"
      :type="type"
      :readonly="readOnly"
    />
  </div>
</template>

<script setup lang="ts">
import InputBox from '@/components/forms/InputBox.vue';

defineProps<{
  title: string;
  explain?: string;
  modelValue: string;
  type?: 'text' | 'password' | 'number' | 'date' | 'time';
  placeholder?: string;
  readOnly?: boolean;
}>();

defineEmits(['update:modelValue']);
</script>
