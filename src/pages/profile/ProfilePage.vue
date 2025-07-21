<template>
  <div class="space-y-6 bg-white px-4">
    <h2 class="mb-2 text-xl font-semibold text-blue-600">마이페이지</h2>
    <!-- Content -->
    <div>
      <!-- Info Box -->
      <div class="my-5 rounded-lg border border-yellow-300 bg-yellow-50 p-4">
        <div class="mb-4 text-base font-bold text-gray-800">
          예약하신 정보를 확인해보세요.
        </div>
        <div class="space-y-2">
          <div class="text-sm text-gray-600">
            <span class="font-bold text-gray-800">일자:</span> 2025년 07월 16일
            오후 1시
          </div>
          <div class="text-sm text-gray-600">
            <span class="font-bold text-gray-800">지점:</span> 국민은행
            제주대리점
          </div>
          <div class="text-sm text-gray-600">
            <span class="font-bold text-gray-800">상품:</span> 증여 상품
          </div>
        </div>
      </div>

      <!-- 자산현황 파이차트 컴포넌트-->
      <AssetSummary userName="000" assetAmount="9,999,999,999,999" />

      <!-- Menu Section -->
      <div class="my-8">
        <button
          v-for="menu in menuItems"
          :key="menu.id"
          @click="handleMenuClick(menu.id)"
          class="my-2 w-full cursor-pointer rounded-lg bg-gray-100 px-5 py-4 text-center text-base text-gray-800 transition-colors hover:bg-gray-400 focus:outline-none"
          type="button"
        >
          {{ menu.title }}
        </button>
      </div>
    </div>

    <!-- 회원탈퇴 -->
    <div class="py-8 text-center text-xs text-gray-400">
      <a href="#" class="text-red-500 no-underline">회원탈퇴</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AssetSummary from '@/components/cards/AssetSummaryCard.vue'; // 상대 경로에 맞게

const router = useRouter();

const menuItems = ref([
  { id: 'asset', title: '자산 추가 등록·수정' },
  { id: 'calculation', title: '자산 재연동' },
  { id: 'revenue', title: '내 지점 수정' },
  { id: 'logout', title: '로그아웃' },
]);

const handleMenuClick = (menuId) => {
  switch (menuId) {
    case 'asset':
      router.push('/asset/edit'); // 자산 추가 등록·수정
      break;
    case 'calculation':
      router.push('/asset/sync'); // 자산 재연동
      break;
    case 'revenue':
      router.push('profile/branch'); // 내 지점 수정
      break;
    case 'logout':
      break;
  }
};
</script>
