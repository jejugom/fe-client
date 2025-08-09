<template>
  <button
    @click="$emit('click')"
    :class="[
      side === 'left' ? 'mr-2' : 'ml-2',
      'w-1/2 rounded-lg border px-4 py-3 text-base font-semibold transition-colors duration-300',
      isActive
        ? // border-transparent 적용으로 전환 시 검은 테두리 보이지 않도록 수정
          'bg-primary-100 text-primary-500 border-transparent'
        : 'text-surface-500 border-surface-200',
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
