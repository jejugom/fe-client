<template>
  <button
    @click="$emit('click')"
    :class="[
      side === 'left' ? 'mr-2' : 'ml-2',
      'btn-pressed w-1/2 rounded-lg border px-4 py-3 text-base font-semibold transition-colors duration-300',
      isActive
        ? 'bg-primary-100 text-primary-500 border-transparent'
        : 'text-surface-500 border-surface-200 bg-white',
    ]"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps<{
  isActive: boolean;
  side?: 'left' | 'right';
}>();

defineEmits<{
  (e: 'click'): void;
}>();
</script>
