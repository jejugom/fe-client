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
      class="absolute top-1/2 -left-2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-colors hover:bg-blue-100"
      @click="prevSlide"
    >
      <
    </button>
    <button
      class="absolute top-1/2 -right-2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md transition-colors hover:bg-blue-100"
      @click="nextSlide"
    >
      >
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

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
