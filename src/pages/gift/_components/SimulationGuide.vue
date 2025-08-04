<template>
  <div class="mb-8 space-y-6">
    <div
      v-for="(item, index) in guideList"
      :key="index"
      class="border-primary-100 rounded-2xl border bg-white p-6 shadow-md"
    >
      <h3 class="text-primary-500 mb-2 text-xl font-bold">
        {{ index + 1 }}. {{ item.title }}
      </h3>
      <p class="text-surface-500 text-sm" v-html="item.desc"></p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface GuideItem {
  title: string;
  desc: string;
}

defineProps<{
  guideList: GuideItem[];
}>();
</script>
