<template>
  <button
    @click="$emit('click')"
    :class="[
      side === 'left' ? 'mr-2' : 'ml-2',
      'w-1/2 rounded-xl px-4 py-3 text-base font-semibold transition-none',
      isActive
        ? 'bg-primary-100 text-primary-500'
        : 'border-surface-200 text-surface-500 border',
    ]"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  isActive: boolean;
  side?: 'left' | 'right';
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();
</script>
