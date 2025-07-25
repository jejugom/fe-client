<!-- 회원가입완료 -->
<template>
  <div class="flex min-h-[calc(80vh-9rem)] items-center">
    <div
      class="stroke-primary px-auto my-auto flex w-full flex-col items-center justify-center gap-16 rounded-xl bg-white py-15"
    >
      <div class="text-center">
        <!-- Figma 크기에 맞추니 조금 작은 느낌이라 추후 크기 조정은 디자인 손보면서 -->
        <p class="text-surface-500 mb-8 text-sm font-semibold"
          >모든 정보 입력이 완료되었습니다</p
        >

        <p class="text-surface-500 mb-8 text-xl font-semibold">
          당신은
          <span class="text-secondary-300 font-hakgyo">{{ userType }}</span>
          입니다!
        </p>

        <div class="text-surface-500 space-y-2 text-lg font-semibold">
          <p class="flex items-end justify-center gap-1"
            >이제
            <span class="text-primary-300 font-hakgyo text-3xl">
              <img :src="Logo" alt="노후도락 로고" class="h-8 w-auto" /></span
            >과 함께</p
          >
          <p>건강한 골든라이프를 시작해보세요!</p>
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
    // const response = await axios.get('/api/user/investment-type');
    // userType.value = response.data.type;
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
