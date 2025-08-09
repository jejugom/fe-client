<template>
  <div
    class="btn-pressed shadow-up-xs flex h-15 w-full items-center gap-4 rounded-lg bg-white p-0 shadow-xs"
    @click="$emit('click')"
  >
    <!-- 카테고리 -->
    <div
      class="flex h-full w-20 items-center justify-center rounded-l-lg rounded-bl-lg font-semibold"
      :class="{
        'bg-secondary-100': category === '상속',
        'bg-primary-100': category === '증여',
      }"
    >
      {{ category }}
    </div>

    <!-- 질문 텍스트 -->
    <div class="w-full">
      {{ question }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps<{
  id: number;
  category: '상속' | '증여'; // ✅ 백엔드 데이터 그대로 사용
  question: string;
}>();

defineEmits<{
  (e: 'click'): void;
}>();
</script>
