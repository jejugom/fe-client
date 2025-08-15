<template>
  <div class="fixed right-4 bottom-24 z-50 flex flex-col gap-3">
    <!-- 텍스트 키우기 -->
    <button
      v-if="showFab"
      @click="increaseFont"
      class="bg-primary-300 h-[64px] w-[64px] rounded-full p-[8px] text-[16px] font-semibold text-white shadow-md"
    >
      <p>글자</p>
      <p>+</p>
    </button>

    <!-- 텍스트 줄이기 -->
    <button
      v-if="showFab"
      @click="decreaseFont"
      class="bg-primary-300 h-[64px] w-[64px] rounded-full p-[8px] text-[16px] font-semibold text-white shadow-md"
    >
      <p>글자</p>
      <p>-</p>
    </button>

    <!-- 위로 가기 -->
    <button
      @click="scrollToTop"
      class="bg-gold h-[64px] w-[64px] rounded-full p-[8px] text-[16px] font-semibold text-white shadow-md"
    >
      <p>맨위</p>
      <p>^</p>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useFontSize } from '@/utils/useFontSize';

const route = useRoute();
const HIDDEN = new Set(['event-quiz', 'event-number', 'event-park']);
const showFab = computed(() => !HIDDEN.has(route.name ?? ''));

// ✅ 공용 폰트 composable 사용
const { init, get, set } = useFontSize();

// px 리스트와 현재 인덱스
const fontSizes = [10, 12, 14, 16, 18, 20];
const currentIndex = ref(3); // 16px 가정

onMounted(() => {
  init(); // 로컬스토리지 값 적용
  // 현재 px → 인덱스 동기화
  const cur = get();
  const idx = fontSizes.indexOf(cur);
  currentIndex.value = idx >= 0 ? idx : fontSizes.indexOf(16);
});

function increaseFont() {
  if (currentIndex.value < fontSizes.length - 1) {
    currentIndex.value++;
    set(fontSizes[currentIndex.value]); // 전역 저장 + 적용
  }
}
function decreaseFont() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    set(fontSizes[currentIndex.value]); // 전역 저장 + 적용
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>
