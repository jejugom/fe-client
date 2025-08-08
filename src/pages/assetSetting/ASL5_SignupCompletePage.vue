<!-- 회원가입완료 -->
<template>
  <div class="flex min-h-[calc(80vh-9rem)] items-center">
    <div
      class="stroke-primary px-auto my-auto flex w-full flex-col items-center justify-center gap-16 rounded-xl bg-white py-15"
    >
      <div class="text-center">
        <p class="text-surface-500 mb-8 font-semibold"
          >자산 정보 입력이 모두 완료됐습니다</p
        >

        <p class="text-surface-500 mb-8 flex items-end text-xl font-semibold">
          고객님은
          <span class="text-secondary-300 font-point mx-1">{{ userType }}</span>
          입니다!
        </p>

        <div class="text-surface-500 space-y-2 text-lg font-semibold">
          <p class="flex items-end justify-center gap-1"
            >앞으로는
            <span class="text-primary-300 font-point text-3xl">
              <img :src="Logo" alt="노후도락 로고" class="h-8 w-auto" /></span
            >과 함께</p
          >
          <p>든든하고 건강한 골든라이프 시작해봐요!</p>
        </div>
      </div>

      <Btn
        @click="goToHome"
        color="secondary"
        label="시작하기"
        size="medium"
      /> </div
  ></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Btn from '@/components/buttons/Btn.vue';
import Logo from '@/assets/logos/typo.svg';

const router = useRouter();
const userType = ref('안정적인 주식형 자산가'); // 개발용 기본값

const fetchUserType = async () => {
  try {
    // TODO: API 호출로 사용자 유형 가져오기
    // [GET] /api/v1/preferences
    //     {
    // 	"segment" : "AB",
    // 	"description":"당신은 안정적인 자산가"
    // }
    // userType.value = response.data.description;
  } catch (error) {
    console.error('사용자 유형 조회 실패:', error);
  }
};

onMounted(() => {
  // TODO: 실제 API 연동 시 주석 해제
  // fetchUserType();
});

const goToHome = () => {
  router.push({ name: 'home' });
};
</script>
