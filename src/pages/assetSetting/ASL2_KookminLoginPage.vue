<template>
  <!-- 상단 안내 문구 (카드 밖) -->

  <h2 class="text-primary-300 mb-2 text-2xl font-bold">자산 연동</h2>
  <div class="text-surface-500 mb-8 text-base">
    <p>자산 정보를 불러오기 위해</p>
    <p>
      <span class="text-gold">국민은행</span> 아이디와 비밀번호가 필요합니다.
    </p>
  </div>

  <!-- 중앙 입력 카드 -->
  <div
    class="border-surface-200 stroke-primary mb-6 flex flex-col gap-3 rounded-xl border px-8 py-12"
  >
    <!-- 입력 필드 -->
    <div class="space-y-6">
      <div>
        <label class="text-surface-500 mb-2 block text-sm">아이디</label>
        <InputBox
          v-model="id"
          placeholder="ID"
          size="medium"
          type="text"
          class="w-full"
        />
      </div>

      <div>
        <label class="text-surface-500 mb-2 block text-sm">비밀번호</label>
        <InputBox
          v-model="password"
          placeholder="Password"
          size="medium"
          type="password"
          class="w-full"
        />
      </div>
    </div>
  </div>

  <div
    class="fixed bottom-[calc(5rem+1rem)] left-1/2 box-border w-full max-w-150 -translate-x-1/2 px-5"
  >
    <!-- 하단 고정 버튼 -->
    <Btn
      :color="isFormFilled ? 'primary' : 'surface'"
      :disabled="!isFormFilled"
      @click="handleAssetSync"
      label="연동하기"
      size="large"
      class="transition-colors duration-500"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';

import Btn from '@/components/buttons/Btn.vue';
import InputBox from '@/components/forms/InputBox.vue';

const route = useRoute();
const router = useRouter();

const id = ref('');
const password = ref('');

// 모든 값이 채워졌는지 여부
const isFormFilled = computed(
  () => id.value.trim() !== '' && password.value.trim() !== ''
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
  console.log('입력한 ID:', id.value);
  console.log('입력한 Password:', password.value);

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
