<template>
  <div
    class="stroke-secondary flex flex-col items-center justify-center gap-8 rounded-xl bg-white px-6 py-8"
  >
    <div class="text-center text-lg font-semibold"
      >예약이 잘 완료되었습니다.<br />방문 예정일에 맞춰 은행에서<br />
      <span class="text-secondary-500">따뜻한 마음으로 기다리겠습니다</span
      >.<br />예약 정보는 문자로도 보내드렸어요!</div
    >
    <Btn
      color="secondary"
      label="메인 페이지로 돌아가기"
      size="medium"
      @click="onClick"
    />
  </div>
</template>

<script setup lang="ts">
import Btn from '@/components/buttons/Btn.vue';
import router from '@/router';

const onClick = () => {
  // 홈페이지로 돌아가기 버튼 클릭 시 동작
  router.push({ name: 'nohoo' });
};
</script>
