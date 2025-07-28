<template>
  <div
    class="border-primary-300 mb-4 flex cursor-pointer items-center gap-6 rounded-xl border p-4"
    @click="onClick"
  >
    <div class="aspect-square w-20 flex-shrink-0 overflow-hidden rounded-lg">
      <img :src="imgSrc" :alt="altText" class="h-full w-full object-cover" />
    </div>
    <div>
      <p class="text-primary-500 text-lg font-semibold">{{ title }}</p>
      <p class="text-surface-500 mt-1">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  imgSrc: string;
  altText?: string;
  title: string;
  description: string;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const onClick = () => emit('click');
</script>
