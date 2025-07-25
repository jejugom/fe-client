<template>
  <div
    class="border-surface-200 flex h-15 w-full items-center gap-4 rounded-xl border bg-white px-3 py-5"
    @click="handleClick"
  >
    <!-- 카테고리 -->
    <div class="text-primary-300 w-8 text-center text-base font-semibold">
      {{ category === 'gift' ? '증여' : '상속' }}
    </div>

    <!-- 질문 텍스트 -->
    <div class="w-full text-base">
      {{ question }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = defineProps<{
  id: number;
  category: string;
  question: string;
}>();

const router = useRouter();

const handleClick = () => {
  router.push({ name: 'faq-detail', params: { id: props.id } });
};
</script>
