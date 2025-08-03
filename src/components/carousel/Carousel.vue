<template>
  <div class="relative w-full overflow-hidden">
    <div
      class="flex w-full transition-transform duration-300 ease-in-out"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div v-for="(item, index) in items" :key="index" class="min-w-full">
        <!-- 여기 slot으로 부모가 넘겨준 내용 렌더링 -->
        <slot :item="item" />
      </div>
    </div>

    <!-- 좌우 이동 버튼 -->
    <button
      class="shadow-up-xs bg-primary-100 btn-pressed absolute top-1/2 left-0.5 z-10 -translate-y-1/2 rounded-full p-2 shadow-xs"
      @click="prevSlide"
    >
      <img :src="ArrowPrev" alt="이전" class="h-4 w-4" />
    </button>
    <button
      class="bg-primary-100 shadow-up-xs btn-pressed absolute top-1/2 right-0.5 z-10 -translate-y-1/2 rounded-full p-2 shadow-xs"
      @click="nextSlide"
    >
      <img :src="ArrowAfter" alt="다음" class="h-4 w-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ArrowAfter from '@/assets/icons/ArrowAfter.svg';
import ArrowPrev from '@/assets/icons/ArrowPrev.svg';

const props = defineProps<{
  items: any[];
}>();

const currentIndex = ref(0);

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % props.items.length;
};

const prevSlide = () => {
  currentIndex.value =
    (currentIndex.value - 1 + props.items.length) % props.items.length;
};
</script>
