<!-- 회원가입완료 -->
<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-4">
    <div class="mb-16 space-y-8 text-center">
      <h1 class="text-surface-500 text-2xl font-bold">
        모든 정보 입력이 완료되었습니다
      </h1>

      <div class="space-y-4">
        <p class="text-primary-300 text-xl font-semibold">
          당신은 {{ userType }} 입니다!
        </p>
        <p class="text-surface-400 text-lg">
          이제 노후도락과 함께 건강한 골든라이프를 시작해보세요!
        </p>
      </div>
    </div>

    <Btn @click="goToHome" color="primary" label="시작하기" size="medium" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Btn from '@/components/buttons/Btn.vue';

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
