<template>
  <div class="card-design btn-pressed relative">
    <!-- 우측 상단 고정 아이콘 -->
    <TextBtn
      color="surface"
      label="보러가기 ➜"
      size="small"
      class="absolute top-4 right-4"
    />

    <a :href="newsItem.link" target="_blank">
      <div
        class="text-primary-500 mr-6 line-clamp-1 w-2/3 text-base font-semibold"
        >{{ newsItem.title }}</div
      >
      <div class="mt-2 line-clamp-2">{{ newsItem.summary }}</div>
      <div class="text-surface-300 text-end">{{ newsItem.date }}</div>
    </a>
  </div>
</template>

<script setup lang="ts">
import TextBtn from '../buttons/TextBtn.vue';

defineProps({
  newsItem: {
    type: Object,
    required: true,
  },
});
</script>
