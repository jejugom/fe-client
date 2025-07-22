<template>
  <div>
    <h2 class="mt-3 mb-3 text-lg font-semibold text-gray-800">
      든든한 노후를 위한 금융상품 3선
    </h2>
    <Carousel :items="items">
      <template #default="{ item }">
        <div class="h-full w-full rounded-lg border-2 border-blue-200 p-5">
          <p class="font-semibold text-gray-800">{{ item.title }}</p>
          <p class="mt-1 text-sm whitespace-pre-line text-gray-600">
            {{ item.description }}
          </p>
        </div>
      </template>
    </Carousel>
  </div>
</template>

<script setup lang="ts">
import Carousel from '@/components/carousel/Carousel.vue';

defineProps<{
  items: {
    title: string;
    description: string;
  }[];
}>();
</script>
