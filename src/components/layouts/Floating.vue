<template>
  <div class="fixed right-4 bottom-24 z-50 flex flex-col gap-3">
    <!-- 텍스트 키우기 -->
    <button
      @click="increaseFont"
      class="bg-primary-300 h-16 w-16 rounded-full px-4 py-2 font-semibold text-white shadow-md"
    >
      <p>글자</p>
      <p>+</p>
    </button>

    <!-- 텍스트 줄이기 -->
    <button
      @click="decreaseFont"
      class="bg-primary-300 h-16 w-16 rounded-full px-4 py-2 font-semibold text-white shadow-md"
    >
      <p>글자</p>
      <p>-</p>
    </button>

    <!-- 위로 가기 -->
    <button
      @click="scrollToTop"
      class="bg-gold h-16 w-16 rounded-full px-4 py-2 font-semibold text-white shadow-md"
    >
      <p>맨위</p>
      <p>^</p>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 폰트 사이즈 px 단위 리스트
const fontSizes = [10, 12, 14, 16, 18, 20];
// 현재 인덱스 (기본값 16px 위치)
const currentIndex = ref(fontSizes.indexOf(16));

// 폰트 크기 적용 함수
function applyFontSize(size) {
  document.documentElement.style.fontSize = `${size}px`;
}

onMounted(() => {
  // 초기값 적용
  applyFontSize(fontSizes[currentIndex.value]);
});

// 키우기
function increaseFont() {
  if (currentIndex.value < fontSizes.length - 1) {
    currentIndex.value++;
    applyFontSize(fontSizes[currentIndex.value]);
  }
}

// 줄이기
function decreaseFont() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    applyFontSize(fontSizes[currentIndex.value]);
  }
}

// 상단이동
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}
</script>
