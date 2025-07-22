<template>
  <div class="my-5 mb-8 rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
    <div class="mb-2 text-base font-bold text-blue-500">
      {{ userName }} 님의 자산 현황
    </div>
    <div class="mb-5 text-lg font-bold text-gray-800">
      {{ assetAmount }} 원
    </div>
    <!-- Chart Placeholder -->
    <div
      class="flex aspect-square w-full items-center justify-center rounded-md bg-gray-200 p-8 text-center"
    >
      자산 현황 파이차트
    </div>
  </div>
</template>

<script setup>
defineProps({
  userName: String,
  assetAmount: [String, Number],
});
</script>
