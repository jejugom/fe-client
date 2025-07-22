<!-- 국민은행로그인 -->
<template>
  <div class="flex min-h-screen items-center justify-center px-4">
    <div
      class="border-surface-200 w-full max-w-md rounded-3xl border bg-white p-12"
    >
      <div class="mb-16 space-y-8 text-center">
        <h1 class="text-primary-300 text-2xl font-bold">자산 연동</h1>
        <div class="space-y-4">
          <p>자산 정보를 불러오기 위해</p>
          <p>국민은행 아이디와 비밀번호가 필요합니다.</p>
        </div>
      </div>

      <div class="space-y-6">
        <div class="flex items-center justify-between gap-4">
          <label class="text-surface-500 w-24">아이디</label>
          <InputBox placeholder="ID" size="medium" type="text" class="flex-1" />
        </div>

        <div class="flex items-center justify-between gap-4">
          <label class="text-surface-500 w-24">비밀번호</label>
          <InputBox
            placeholder="Password"
            size="medium"
            type="password"
            class="flex-1"
          />
        </div>

        <div class="flex justify-center pt-4">
          <Btn
            @click="handleAssetSync"
            color="primary"
            label="연동하기"
            size="medium"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
const route = useRoute();

import Btn from '@/components/buttons/Btn.vue';
import InputBox from '@/components/forms/InputBox.vue';

const router = useRouter();

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

  // 현재는 임시로 자산 연동 완료 페이지로 이동
  const isFromProfile = route.query.from === 'profile';

  if (isFromProfile) {
    // 프로필에서 시작한 경우 -> 프로필 페이지로 돌아가기
    // TODO : 자산 연동이 완료되었다고 알려주기
    router.push({ name: 'profile' });
  } else {
    // 회원가입 과정인 경우 -> 다음 스텝으로 이동
    router.push({ name: 'asset-custom-start' });
  }
};
</script>
