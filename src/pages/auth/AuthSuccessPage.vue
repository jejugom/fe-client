<!--
  카카오 로그인 성공 처리 페이지
  
  백엔드에서 /auth/success로 리다이렉트된 후 URL 파라미터로 전달받은 
  토큰 정보를 처리하고 적절한 페이지로 이동시키는 중간 페이지입니다.
  > 로그인 성공시 이 페이지는 사용자에게 보이지 않고 바로 다음 페이지로 넘어가게 됩니다.
  
  처리 과정:
  1. URL 파라미터에서 토큰 정보 추출
  2. JWT에서 사용자 정보 파싱
  3. Pinia store에 인증 상태 저장
  4. 신규/기존 회원에 따라 적절한 페이지로 리다이렉트
-->
<template>
  <div class="flex min-h-[calc(80vh-9rem)] items-center justify-center">
    <div class="text-center">
      <!-- 로딩 상태 -->
      <div v-if="isProcessing" class="space-y-4">
        <div
          class="border-primary-300 mx-auto h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
        ></div>
        <p class="text-lg text-gray-600">로그인 처리 중</p>
      </div>

      <!-- 오류 상태 -->
      <div v-else-if="error" class="space-y-4">
        <!-- 오류 설명 -->
        <p class="text-lg">{{ error }}</p>

        <Btn
          @click="goHome"
          color="primary"
          size="large"
          label="홈으로 돌아가기"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Btn from '@/components/buttons/Btn.vue';
import { useLoadingStore } from '@/stores/loading';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const loadingStore = useLoadingStore();

/** 로그인 처리 진행 상태 */
const isProcessing = ref(true);

/** 오류 메시지 */
const error = ref('');

/**
 * 컴포넌트 마운트 시 카카오 로그인 성공 처리
 *
 * 백엔드에서 리다이렉트로 전달받은 URL 파라미터를 파싱하여
 * 사용자 인증 상태를 설정하고 적절한 페이지로 이동시킵니다.
 */
onMounted(async () => {
  try {
    loadingStore.startLoading();
    // 1. URL 쿼리 파라미터에서 토큰 정보 추출
    const { token, refreshToken, isNew, isTendencyNotDefined, state } =
      route.query;
    console.log('AuthSuccessPage received state:', state);
    console.log('AuthSuccessPage received isNew:', isNew);
    console.log(
      'AuthSuccessPage received isTendencyNotDefined:',
      isTendencyNotDefined
    );

    // 2. 필수 토큰 정보 검증
    if (!token || !refreshToken) {
      throw new Error('토큰 정보가 없습니다.');
    }

    // 3. JWT 토큰에서 사용자 정보 추출
    // JWT는 header.payload.signature 구조이므로 payload 부분을 Base64 디코딩
    const tokenPayload = JSON.parse(atob((token as string).split('.')[1]));
    const userEmail = tokenPayload.sub; // JWT의 subject는 사용자 이메일

    // 4. Pinia store에 인증 상태 저장
    authStore.setKakaoLoginData(
      token as string,
      refreshToken as string,
      userEmail,
      userEmail.split('@')[0], // 이메일의 @ 앞부분을 사용자명으로 사용
      isNew === 'true'
    );

    // 5. 회원 유형에 따른 페이지 이동
    const nextRoute = state ? String(state) : 'home';

    if (isNew === 'true') {
      // 신규 회원 → 튜토리얼 페이지로 이동
      console.log('신규 회원 - asset-tutorial로 이동');
      router.replace({ name: 'asset-tutorial' });
    } else if (isTendencyNotDefined === 'true') {
      // 성향 미입력 회원 → 일단 튜토리얼 페이지로 이동 (추후 custom-quiz로 변경 고려)
      console.log(
        '성향 미입력 회원 - asset-tutorial로 이동 (추후 custom-quiz로 변경 고려)'
      );
      router.replace({ name: 'asset-tutorial' });
    } else {
      // 기존 회원 → 원래 가려던 페이지 또는 홈페이지로 이동
      console.log('기존 회원 -', nextRoute, '로 이동');
      router.replace({ name: nextRoute });
    }
  } catch (err) {
    // 6. 오류 처리
    console.error('Auth processing error:', err);
    loadingStore.setError(true);
    error.value =
      err instanceof Error
        ? err.message
        : '로그인 처리 중 오류가 발생했습니다.';
    isProcessing.value = false;
  } finally {
    loadingStore.stopLoading();
  }
});

/**
 * 홈페이지로 이동
 */
const goHome = () => {
  router.push({ name: 'home' });
};
</script>
