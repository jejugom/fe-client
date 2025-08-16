<template>
  <header
    class="relative flex h-[64px] items-center justify-center bg-white shadow-xs"
  >
    <!-- 뒤로가기 -->
    <img
      v-if="showBackBtn"
      :src="Arrow"
      alt="뒤로가기 아이콘"
      class="absolute left-5 h-[24px] w-[24px]"
      @click="goBack"
    />

    <!-- 로고 텍스트 -->
    <router-link :to="{ name: 'home' }" class="text-2xl font-bold">
      <img :src="Logo" alt="노후도락 로고" class="h-[40px] w-auto" />
    </router-link>
  </header>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { computed, onMounted, onUnmounted } from 'vue';
import Arrow from '@/assets/icons/HeaderBefore.svg';
import Logo from '@/assets/logos/typo.svg';

const router = useRouter();
const route = useRoute();

function goBack() {
  // 완료 페이지에서는 무조건 홈으로
  if (route.name === 'register-complete') {
    router.push({ name: 'home' });
    return;
  }

  // 그 외 페이지: 내부 이동이면 back, 외부에서 진입이면 홈
  const referrer = document.referrer || '';
  const isInternal = referrer.includes(window.location.host);
  if (isInternal) {
    router.back();
  } else {
    router.push({ name: 'home' });
  }
}

const showBackBtn = computed(() => {
  return !['home', 'not-found', 'fail', 'loading'].includes(
    route.name as string
  );
});

// 브라우저/앱 하드웨어 뒤로가기 대응
function onPopState() {
  if (route.name === 'register-complete') {
    router.replace({ name: 'home' });
  }
}

// 페이지 진입
onMounted(() => {
  // 완료 페이지에서 뒤로가기로 직전 폼이 보이는 것을 막기
  if (route.name === 'register-complete') {
    window.history.pushState(null, '', window.location.href);
  }
  window.addEventListener('popstate', onPopState);
});

// 페이지 이탈
onUnmounted(() => {
  window.removeEventListener('popstate', onPopState);
});
</script>
