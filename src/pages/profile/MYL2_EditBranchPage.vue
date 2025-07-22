<template>
  <div class="flex min-h-screen flex-col px-4 py-8">
    <!-- 현재 위치 표시 -->
    <div class="mb-8">
      <h1 class="text-primary-300 mb-5 text-left text-2xl font-bold">
        자산 관리 계획 도우미
      </h1>

      <h2 class="text-surface-500 font-semibold"
        >현재 위치: 서울특별시 광진구</h2
      >
    </div>

    <!-- 검색 영역 -->
    <div class="mb-6 flex items-center gap-2">
      <InputBox
        placeholder="지점 입력 (예: 광진구)"
        size="medium"
        type="text"
        class="flex-1"
      />
      <Btn @click="handleSearch" color="primary" label="검색" size="small" />
    </div>

    <!-- 지도 영역 -->
    <div class="bg-surface-100 mb-8 h-96 w-full rounded-lg">
      <!-- TODO: 카카오맵 API 연동 -->
    </div>

    <!-- 하단 버튼 -->
    <div class="mt-auto flex justify-center">
      <Btn
        @click="handleComplete"
        color="primary"
        label="완료하기"
        size="medium"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import InputBox from '@/components/forms/InputBox.vue';
import Btn from '@/components/buttons/Btn.vue';

const router = useRouter();
const route = useRoute(); // useRoute 추가
const searchQuery = ref('');

const handleSearch = () => {
  // TODO: 카카오맵 API로 위치 검색
  console.log('위치 검색:', searchQuery.value);
};

const handleComplete = async () => {
  try {
    // TODO: API 호출하여 지점 정보 업데이트

    // 쿼리 파라미터에 따라 다른 페이지로 이동
    if (route.query.from === 'profile') {
      router.push({ name: 'profile' });
    } else {
      router.push({ name: 'asset-signup-complete' });
    }
  } catch (error) {
    console.error('지점 업데이트 실패:', error);
  }
};
</script>

<style scoped></style>
