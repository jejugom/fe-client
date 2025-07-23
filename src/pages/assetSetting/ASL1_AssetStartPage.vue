<!-- 자산연동시작 -->
<template>
  <div class="flex min-h-screen items-center justify-center px-4">
    <div
      class="border-surface-200 w-full max-w-md rounded-3xl border bg-white p-8"
    >
      <div class="mb-12 space-y-6 text-center">
        <h1 class="text-primary-300 text-2xl font-bold">
          <!-- TODO : 사용자의 이름으로 동적으로 넣기 -->
          최승아님, 안녕하세요!
        </h1>
        <div class="space-y-2">
          <p>더 정확한 서비스 제공을 위해서</p>
          <p
            ><span class="text-primary-300">자산 연동</span>을
            진행하겠습니다.</p
          >
        </div>
      </div>

      <div class="flex justify-center">
        <Btn
          @click="goToKookminLogin"
          color="primary"
          label="시작하기"
          size="medium"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Btn from '@/components/buttons/Btn.vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const goToKookminLogin = () => {
  // 현재 route의 쿼리 파라미터 확인
  const isFromProfile = route.query.from === 'profile';

  // 쿼리 파라미터가 있다면 다음 페이지로도 전달
  router.push({
    name: 'asset-kookmin-login',
    query: isFromProfile ? { from: 'profile' } : {},
  });
};
</script>
