<template>
  <div class="w-full">
    <!-- 프로그레스바 헤더 -->
    <div class="mb-3 flex items-center justify-between">
      <span class="text-primary-500 text-sm font-medium">진행률</span>
      <span class="text-primary-500 text-sm">
        {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}
      </span>
    </div>

    <!-- 프로그레스바 본체 -->
    <div class="relative">
      <div
        class="bg-primary-100 h-4 w-full overflow-hidden rounded-full shadow-inner"
      >
        <div
          class="bg-primary-300 relative h-full overflow-hidden rounded-full transition-all duration-500 ease-out"
          :style="{ width: progressPercentage }"
        >
          <!-- 프로그레스바 내부 하이라이트 효과 -->
          <div class="absolute inset-0 rounded-full bg-white opacity-20"></div>
          <!-- 움직이는 하이라이트 효과 -->
          <div
            class="absolute top-0 left-0 h-full w-6 -skew-x-12 transform animate-pulse rounded-full bg-white opacity-30"
          ></div>
        </div>

        <!-- 프로그레스바 끝부분 아이콘 -->
        <div
          class="absolute top-1/2 -translate-y-1/2 transform transition-all duration-500 ease-out"
          :style="{ left: `calc(${progressPercentage} - 8px)` }"
        >
          <div
            class="bg-primary-400 h-4 w-4 rounded-full border-2 border-white shadow-md"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  currentQuestionIndex: number;
  totalQuestions: number;
}

const props = defineProps<Props>();

// 프로그레스바 percentage 계산
const progressPercentage = computed(() => {
  if (props.totalQuestions === 0) {
    return '0%';
  }
  return `${((props.currentQuestionIndex + 1) / props.totalQuestions) * 100}%`;
});
</script>
