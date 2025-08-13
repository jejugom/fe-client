<!--
  카카오 로그인 실패 처리 페이지
  
  백엔드에서 로그인 처리 중 오류가 발생했을 때 /auth/error로 리다이렉트되어
  사용자에게 오류 메시지를 표시하고 재시도 옵션을 제공하는 페이지 입니다.

  etc의 ETL FailPage 출력내용으로 대체 가능합니다.
  
  주요 기능:
  - 오류 메시지 표시 (URL 파라미터로 전달받음)
  - 카카오 로그인 재시도 버튼
  - 홈으로 돌아가기 버튼
-->
<template>
  <div class="flex min-h-[calc(80vh-9rem)] items-center justify-center">
    <div class="space-y-4 text-center">
      <!-- 에러 아이콘 GPT -->
      <div>
        <img :src="ErrorIcon" alt="Error Icon" class="mx-auto h-16 w-16" />
      </div>

      <h1 class="text-surface-500 text-2xl font-bold">로그인 실패</h1>

      <!-- 오류 메시지 표시 -->
      <p class="text-surface-500 text-lg">
        {{ errorMessage || '로그인 처리 중 오류가 발생했습니다.' }}
      </p>

      <!-- 버튼 -->

      <BtnSet
        :label1="'다시시도'"
        @click1="retry"
        :label2="'돌아가기'"
        @click2="goHome"
        type="type2"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import BtnSet from '@/components/buttons/BtnSet.vue';
import ErrorIcon from '@/assets/icons/ErrorIcon.svg';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

/**
 * URL 파라미터에서 오류 메시지 추출 및 디코딩
 *
 * 백엔드에서 URL 인코딩된 한글 오류 메시지를 받아와서 디코딩합니다.
 * 디코딩 실패 시 원본 메시지를 그대로 사용합니다.
 */
const errorMessage = computed(() => {
  const message = route.query.message as string;
  try {
    // URL 디코딩 시도 (한글 메시지 처리)
    return message ? decodeURIComponent(message) : '';
  } catch {
    // 디코딩 실패 시 원본 메시지 반환
    return message || '';
  }
});

/**
 * 카카오 로그인 재시도
 *
 * 오류가 발생한 후 사용자가 다시 로그인을 시도할 때 호출됩니다.
 * auth store의 startKakaoLogin을 통해 카카오 인증 페이지로 리다이렉트합니다.
 */
const retry = () => {
  authStore.startKakaoLogin();
};

/**
 * 홈페이지로 이동
 *
 * 로그인을 포기하고 홈페이지로 돌아갈 때 사용됩니다.
 */
const goHome = () => {
  router.push({ name: 'home' });
};
</script>
