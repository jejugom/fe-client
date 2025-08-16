<!--
로그인 성공 후 처리 페이지 (쿠키 방식)

백엔드에서 쿠키 설정을 완료하고 이 페이지로 리다이렉트합니다.
이 페이지의 역할은 백엔드에 현재 로그인한 사용자의 정보를 요청하여
상태(Store)를 업데이트하고, 사용자 유형에 따라 적절한 페이지로 이동시키는 것입니다.
    -->
<template>
  <div class="flex min-h-[calc(80vh-9rem)] items-center justify-center">
    <div class="text-center">
      <!-- 로딩 상태 -->
      <div v-if="isProcessing" class="space-y-4">
        <div
          class="border-primary-300 mx-auto h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
        ></div>
        <p class="text-lg text-gray-600">로그인 정보 확인 중...</p>
      </div>

      <!-- 오류 상태 -->
      <div v-else-if="error" class="space-y-4">
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
import { useLoadingStore } from '@/stores/loading';
import Btn from '@/components/buttons/Btn.vue';
import api from '@/api/index';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const loadingStore = useLoadingStore();

const isProcessing = ref(true);
const error = ref('');

function q(v: unknown): string {
  if (Array.isArray(v)) return String(v[0] ?? '');
  return v != null ? String(v) : '';
}

onMounted(async () => {
  try {
    loadingStore.startLoading();

    const isNew = q(route.query.isNew) === 'true';
    const isTendencyNotDefined = q(route.query.isTendencyNotDefined) === 'true';
    const nextState = q(route.query.state) || 'home';

    const response = await api.get('/auth/profile');
    const userProfile = response.data;

    if (!userProfile || !userProfile.email) {
      throw new Error('서버에서 사용자 정보를 가져오는 데 실패했습니다.');
    }

    // [수정] setKakaoLoginData 함수에 올바른 개수(3개)의 인자를 전달합니다.
    authStore.setKakaoLoginData(
      userProfile.email,
      userProfile.displayName,
      isNew
    );

    if (isNew || isTendencyNotDefined) {
      router.replace({ name: 'asset-tutorial' });
    } else {
      router.replace({ name: nextState });
    }
  } catch (err: any) {
    console.error('Auth processing error:', err);
    loadingStore.setError(true);
    error.value =
      err?.response?.data?.message ||
      err?.message ||
      '로그인 처리 중 오류가 발생했습니다.';
    isProcessing.value = false;
  } finally {
    loadingStore.stopLoading();
  }
});

const goHome = () => router.push({ name: 'home' });
</script>
