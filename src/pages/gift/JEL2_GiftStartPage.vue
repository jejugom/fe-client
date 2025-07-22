<template>
  <div class="px-6 py-10">
    <!-- 제목 -->
    <h2 class="mb-2 text-xl font-semibold text-blue-600">증여</h2>
    <p class="mb-6 text-gray-800">
      자녀나 손주에게 재산을 나눠주기 전,<br />
      세금이 얼마나 나올지 미리 확인해보세요.
    </p>

    <!-- 예시 이미지 영역 (대체 박스) -->
    <div
      class="mb-6 flex h-52 w-full items-center justify-center rounded-lg bg-gray-200"
    >
      <span class="text-gray-500">이미지</span>
    </div>

    <!-- 안내 문구 -->
    <p class="mb-6 text-center text-sm text-gray-700">
      얼마를, 누구에게, 언제 주면 좋을지<br />세금까지 포함해 쉽게
      계산해드립니다.
    </p>

    <!-- 버튼 -->
    <button
      class="w-full rounded-md bg-gray-100 py-3 font-semibold text-blue-600 shadow-sm hover:bg-blue-50"
      @click="goToInput"
    >
      증여 계획 미리 계산해보기
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goToInput() {
  router.push({ name: 'gift-input' }); // 증여 계획 입력 페이지로 이동
}
</script>
