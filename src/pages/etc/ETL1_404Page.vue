<template>
  <div class="flex flex-col items-center justify-center gap-8">
    <div class="text-gold font-hakgyo text-5xl">404</div>

    <div class="text-center text-lg font-bold">
      입력하신 주소가 잘못되었거나,<br />이동된 페이지일 수 있어요. <br />
      <span class="text-gold">노후도락 항상 곁에 있습니다.</span>
    </div>
    <Btn
      color="primary"
      label="홈으로 돌아가기"
      size="large"
      @click="onClick"
      class="stroke-primary"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import Btn from '@/components/buttons/Btn.vue';

const router = useRouter();

const onClick = () => {
  router.push({ name: 'home' });
};
</script>
