<template>
  <!-- 상단 안내 문구 (카드 밖) -->
  <div class="card-design py-8">
    <h1 class="text-primary-500 mb-8 text-center text-2xl font-bold">
      {{ authStore.userName }}님, 안녕하세요!
    </h1>
    <div class="flex flex-col items-center gap-4 text-center">
      <div>
        <p class="text-lg font-semibold">더 정확한 서비스 제공을 위해서</p>
        <p class="mb-4 text-lg font-semibold"
          ><span class="text-primary-300">자산 연동</span>을 진행하겠습니다.</p
        >
      </div>
      <div>
        <p>
          <span class="text-gold font-semibold">국민은행</span>에 있는 내 자산을
          불러오기 위해<br />
          <span class="text-gold font-semibold">국민은행</span> 홈페이지에
          로그인해요.
        </p>
      </div>
      <div>
        입력하신 정보는 오직 자산 확인 용도로만 사용돼요.<br />
        안전하니 걱정 마시고 진행하셔도 됩니다.
      </div>
    </div>

    <!-- 중앙 입력 카드 -->
    <div
      class="px-auto mt-8 mb-4 flex flex-col items-center justify-center gap-4"
    >
      <!-- 입력 필드 -->
      <LoginForm
        :credentials="credentials"
        @update:credentials="credentials = $event"
      />
    </div>
  </div>
  <BtnSet
    label1="건너뛰기"
    label2="연동하기"
    @click1="handleSkip"
    @click2="handleAssetSync"
    type="type2"
    class="mt-16"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

import Btn from '@/components/buttons/Btn.vue';
import LoginForm from './_components/LoginForm.vue';
import { codefApi } from '@/api/asset/codef';
import { useLoadingStore } from '@/stores/loading';
import BtnSet from '@/components/buttons/BtnSet.vue';

const route = useRoute();
const router = useRouter();
const loadingStore = useLoadingStore();
const authStore = useAuthStore();

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

// 건너뛰기 버튼 처리
const handleSkip = () => {
  router.push({ name: 'asset-custom-quiz' });
};

// Enter 키 이벤트 처리
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && isFormFilled.value) {
    handleAssetSync();
  }
};

// 컴포넌트 마운트 시 Enter 키 이벤트 등록
onMounted(() => {
  window.addEventListener('keypress', handleKeyPress);
});

// 컴포넌트 언마운트 시 Enter 키 이벤트 제거
onUnmounted(() => {
  window.removeEventListener('keypress', handleKeyPress);
});

const handleAssetSync = async () => {
  if (!isFormFilled.value) {
    alert('아이디와 비밀번호를 모두 입력해주세요.');
    return;
  }
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
      router.push({ name: 'asset-custom-quiz' });
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
