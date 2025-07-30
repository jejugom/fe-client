<template>
  <div
    class="border-surface-200 flex h-15 w-full items-center gap-4 rounded-xl border bg-white px-3 py-5"
    @click="$emit('click')"
  >
    <!-- 카테고리 -->
    <div class="text-primary-300 w-8 text-center text-base font-semibold">
      {{ categoryLabel }}
    </div>

    <!-- 질문 텍스트 -->
    <div class="w-full text-base">
      {{ question }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';

const props = defineProps<{
  id: number;
  category: string; // '상' | '증'
  question: string;
}>();

defineEmits<{
  (e: 'click'): void;
}>();

const categoryLabel = computed(() =>
  props.category === '증' ? '증여' : '상속'
);
</script>
