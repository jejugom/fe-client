<template>
  <div
    class="border-surface-200 flex h-15 w-full items-center gap-4 rounded-lg border bg-white px-3 py-5"
    @click="$emit('click')"
  >
    <!-- 카테고리 -->
    <div class="text-primary-300 w-12 text-center text-base font-semibold">
      {{ category }}
    </div>

    <!-- 질문 텍스트 -->
    <div class="w-full text-base">
      {{ question }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  id: number;
  category: '상속' | '증여'; // ✅ 백엔드 데이터 그대로 사용
  question: string;
}>();

defineEmits<{
  (e: 'click'): void;
}>();
</script>
