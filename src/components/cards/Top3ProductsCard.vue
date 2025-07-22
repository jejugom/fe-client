<template>
  <div>
    <Carousel :items="items">
      <template #default="{ item }">
        <div class="flex w-full justify-center">
          <div
            class="border-surface-200 flex h-32 w-4/5 flex-col justify-start gap-2 rounded-xl border px-6 py-4"
          >
            <div class="flex items-center justify-between">
              <p class="text-lg font-semibold">{{ item.prod_name }}</p>
              <p class="text-primary-300 font-semibold"> {{ item.rate }}%</p>
            </div>

            <p class="whitespace-pre-line">
              {{ item.description }}
            </p>
          </div>
        </div>
      </template>
    </Carousel>
  </div>
</template>

<script setup lang="ts">
import Carousel from '@/components/carousel/Carousel.vue';

defineProps<{
  items: {
    prod_name: string;
    description: string;
    rate: number;
  }[];
}>();
</script>
