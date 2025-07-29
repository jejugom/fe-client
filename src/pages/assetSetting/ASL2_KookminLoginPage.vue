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

const route = useRoute();
const router = useRouter();

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

const handleAssetSync = () => {
  // TODO: CODEF : 국민은행 API 연동 로직 추가
  // Body: {
  //   bankId: '',
  //   id: '',
  //   password: '',
  // }
  // POST 요청을 보내야 합니다.
  // 예시: axios.post();
  // 성공적으로 연동되면 다음 페이지로 이동
  // 실패하면 에러 메시지를 표시해야 합니다.

  // 현재 임시로 ID, Password 콘솔 출력
  console.log('입력한 ID:', credentials.value.id);
  console.log('입력한 Password:', credentials.value.password);

  // 현재 route의 쿼리 파라미터 확인
  const isFromProfile = route.query.from === 'profile';

  if (isFromProfile) {
    // 프로필에서 시작한 경우 -> 프로필 페이지로 돌아가기
    // TODO : 자산 연동이 완료되었다고 알려주기 페이지 구현 필요?
    // UX 적으로 고민해야함

    router.push({ name: 'profile' });
  } else {
    // 회원가입 과정인 경우 -> 다음 스텝으로 이동
    router.push({ name: 'asset-custom-start' });
  }
};
</script>
