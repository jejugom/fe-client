<template>
  <div class="mb-16 space-y-6">
    <div
      v-for="(item, index) in guideList"
      :key="index"
      class="card-design flex h-36 flex-col justify-center"
    >
      <h3 class="text-primary-300 mb-2 text-xl font-bold">
        {{ index + 1 }}. {{ item.title }}
      </h3>
      <p class="text-surface-500 text-base" v-html="item.desc"></p>
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
