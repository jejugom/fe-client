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

const isProcessing = ref(true);
const error = ref('');

// string | string[] | undefined → string 로 안전 변환
function q(v: unknown): string {
  if (Array.isArray(v)) return String(v[0] ?? '');
  return v != null ? String(v) : '';
}

// base64url 안전 디코더
function base64UrlToUtf8(input: string) {
  let s = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = s.length % 4;
  if (pad) s += '='.repeat(4 - pad);

  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder('utf-8').decode(bytes);
}

onMounted(async () => {
  try {
    loadingStore.startLoading();

    // 1) 쿼리 안전 추출
    const token = q(route.query.token);
    const refreshToken = q(route.query.refreshToken);
    const isNew = q(route.query.isNew) === 'true';
    const isTendencyNotDefined = q(route.query.isTendencyNotDefined) === 'true';
    const nextState = q(route.query.state) || 'home';

    if (!token || !refreshToken) {
      throw new Error('토큰 정보가 없습니다.');
    }

    // 2) JWT payload 안전 파싱 (base64url)
    const parts = token.split('.');
    if (parts.length < 2) throw new Error('올바르지 않은 토큰 형식입니다.');
    const payloadStr = base64UrlToUtf8(parts[1]);
    const payload = JSON.parse(payloadStr);

    // 3) 이메일/표시명 추출 (여러 클레임 대비 + 폴백)
    const email = payload.email ?? payload.sub ?? ''; // 꼭 문자열 보장
    if (!email) throw new Error('토큰에 사용자 이메일 정보가 없습니다.');

    const displayName =
      payload.name ??
      payload.nickname ??
      payload.preferred_username ??
      // 마지막 폴백: 이메일 로컬파트
      (email.includes('@') ? email.split('@')[0] : '고객님');

    // 4) 스토어 저장
    authStore.setKakaoLoginData(
      token,
      refreshToken,
      String(email),
      String(displayName),
      isNew
    );

    // 5) 라우팅
    if (isNew) {
      router.replace({ name: 'asset-tutorial' });
    } else if (isTendencyNotDefined) {
      router.replace({ name: 'asset-tutorial' });
    } else {
      router.replace({ name: nextState });
    }
  } catch (err: any) {
    // 6) 오류 처리
    console.error('Auth processing error:', err);
    loadingStore.setError(true);
    error.value = err?.message ?? '로그인 처리 중 오류가 발생했습니다.';
    isProcessing.value = false;
  } finally {
    loadingStore.stopLoading();
  }
});

// 홈페이지로 이동
function goHome() {
  router.push({ name: 'home' });
}
</script>
