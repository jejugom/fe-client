<template>
  <div
    class="relative left-1/2 w-screen max-w-[600px] -translate-x-1/2 overflow-hidden"
  >
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
      class="custom-shadow bg-primary-100 btn-pressed absolute top-1/2 left-0.5 z-10 -translate-y-1/2 rounded-full p-2"
      @click="prevSlide"
    >
      <img :src="ArrowPrev" alt="이전" class="h-4 w-4" />
    </button>
    <button
      class="bg-primary-100 custom-shadow btn-pressed absolute top-1/2 right-0.5 z-10 -translate-y-1/2 rounded-full p-2"
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

const currentIndex = ref(0); // 현재 슬라이드 인덱스

// 다음 슬라이드로 이동
function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % props.items.length;
}

// 이전 슬라이드로 이동
function prevSlide() {
  currentIndex.value =
    (currentIndex.value - 1 + props.items.length) % props.items.length;
}
</script>
