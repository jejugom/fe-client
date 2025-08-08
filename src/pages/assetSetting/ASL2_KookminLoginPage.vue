<template>
  <!-- 상단 안내 문구 (카드 밖) -->

  <h1 class="text-primary-300 text-2xl font-bold"
    >내 계좌를 불러오려면 로그인이 필요해요</h1
  >
  <div class="text-surface-500 mt-4">
    <p>
      <span class="text-gold font-semibold">국민은행</span>에 있는 내 자산을
      불러오기 위해
      <span class="text-gold font-semibold">국민은행</span> 홈페이지에
      로그인해요.<br />
      입력하신 정보는 오직 자산 확인 용도로만 사용돼요.<br />
      안전하니 걱정 마시고 진행하셔도 됩니다.</p
    >
  </div>

  <!-- 중앙 입력 카드 -->
  <div
    class="stroke-primary px-auto my-16 flex flex-col items-center justify-center gap-3 rounded-xl py-8"
  >
    <!-- 입력 필드 -->
    <LoginForm
      :credentials="credentials"
      @update:credentials="credentials = $event"
    />
  </div>

  <BtnSet
    label1="이전으로"
    label2="다음으로"
    type="type2"
    @click2="handleAssetSync"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';

import BtnSet from '@/components/buttons/BtnSet.vue';
import LoginForm from './_components/LoginForm.vue';
import { codefApi } from '@/api/asset/codef';
import { useLoadingStore } from '@/stores/loading';

const route = useRoute();
const router = useRouter();
const loadingStore = useLoadingStore();

const credentials = ref({
  id: '',
  password: '',
});

// 모든 값이 채워졌는지 여부
const isFormFilled = computed(
  () =>
    credentials.value.id.trim() !== '' &&
    credentials.value.password.trim() !== ''
);

const handleAssetSync = async () => {
  loadingStore.startLoading();
  try {
    // CODEF 국민은행 API 연동 요청 데이터
    const requestData = {
      accountList: [
        {
          countryCode: 'KR',
          businessType: 'BK',
          clientType: 'P', // 개인
          organization: '0004', // 국민은행 코드
          loginType: '1', // 0: 공인인증서 로그인, 1: IDPW 로그인
          password: credentials.value.password,
          id: credentials.value.id,
          birthday: '', // 선택 사항
        },
      ],
    };

    // CODEF API 호출
    const response = await codefApi.connect(requestData);

    console.log('자산 연동 성공:', response);

    // 현재 route의 쿼리 파라미터 확인
    const isFromProfile = route.query.from === 'profile';

    if (isFromProfile) {
      // 프로필에서 시작한 경우 -> 프로필 페이지로 돌아가기
      router.push({ name: 'profile' });
    } else {
      // 회원가입 과정인 경우 -> 다음 스텝으로 이동
      router.push({ name: 'asset-custom-start' });
    }
  } catch (error: any) {
    console.error('자산 연동 실패:', error);

    // 에러 메시지 표시
    if (error.code === 'ECONNABORTED') {
      alert('자산 연동 처리 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.');
    } else if (error.response?.status === 401) {
      alert('국민은행 로그인 정보가 올바르지 않습니다. 다시 확인해주세요.');
    } else if (error.response?.status === 500) {
      alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } else {
      alert('자산 연동 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  } finally {
    loadingStore.stopLoading();
  }
};
</script>
