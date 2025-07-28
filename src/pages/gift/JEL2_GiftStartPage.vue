<template>
  <!-- 제목 -->
  <h2 class="text-primary-300 mb-2 text-2xl font-bold">상속·증여</h2>
  <p class="text-surface-500 mb-8 text-base">
    자녀나 손주에게 재산을 나눠주기 전,<br />
    세금이 얼마나 나올지 미리 확인해보세요.
  </p>

  <!-- 예시 이미지 영역 -->
  <div
    class="bg-gradient-cross-1 mb-16 flex h-80 w-full items-center justify-center"
  >
    <span class="text-surface-500">예시 이미지</span>
  </div>

  <!-- 하단 고정 안내 + 버튼 -->
  <div>
    <p class="text-primary-300 mb-4 text-center text-base font-semibold">
      얼마를, 누구에게, 언제 주면 좋을지<br />
      세금까지 포함해 쉽게 계산해드립니다.
    </p>
    <Btn
      color="primary"
      label="증여 계획 미리 계산해보기"
      size="large"
      @click="goToInput"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import Btn from '@/components/buttons/Btn.vue';

const router = useRouter();

function goToInput() {
  router.push({ name: 'gift-input' });
}
</script>
