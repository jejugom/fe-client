<template>
  <!-- Info Box -->
  <div class="border-secondary-300 mb-8 rounded-lg border p-4">
    <div class="text-secondary-500 mb-2 text-lg font-semibold">
      예약하신 정보를 확인해보세요.
    </div>
    <div class="space-y-1">
      <div class="text-surface-500 text-sm">
        <span class="font-semibold">일자:</span> 2025년 07월 16일 오후 1시
      </div>
      <div class="text-surface-500 text-sm">
        <span class="font-semibold">지점:</span> 국민은행 제주대리점
      </div>
      <div class="text-surface-500 text-sm">
        <span class="font-semibold">상품:</span> 증여 상품
      </div>
    </div>
  </div>

  <!-- 자산현황 파이차트 컴포넌트-->
  <AssetSummaryCardPie
    :userName="retirement.user_info.user_name"
    :assetAmount="retirement.user_info.asset_info.total"
    :assetInfo="retirement.user_info.asset_info"
  />

  <!-- Menu Section -->
  <div class="mt-16 flex flex-col gap-4">
    <Btn
      color="secondary"
      :label="menu.title"
      size="large"
      v-for="menu in menuItems"
      :key="menu.id"
      @click="handleMenuClick(menu.id)"
    />
  </div>

  <!-- 로그아웃 및 회원탈퇴 -->
  <div class="mt-4 flex items-center justify-end gap-4 text-xs text-red-300">
    <div class="cursor-pointer underline" @click="handleLogout">로그아웃</div>
    <p class="cursor-pointer underline" @click="showModal = true">회원탈퇴</p>
  </div>

  <!-- 회원탈퇴 모달 -->
  <Modal
    v-if="showModal"
    @click1="cancelModal"
    @click2="confirmWithdrawal"
    title="정말 탈퇴하시겠습니까?"
    leftLabel="아니오"
    rightLabel="예"
    :rightDisabled="confirmText !== '노후도락 서비스를 종료합니다.'"
  >
    <p class="text-surface-500 mb-4 text-center text-xs">
      탈퇴를 원하신다면 아래 입력창에<br />
      <strong>"노후도락 서비스를 종료합니다."</strong>를 입력해주세요.
    </p>
    <input
      v-model="confirmText"
      type="text"
      placeholder="노후도락 서비스를 종료합니다."
      class="rounded border px-3 py-2 text-sm"
    />
    <p
      v-if="
        showModal &&
        confirmText &&
        confirmText !== '노후도락 서비스를 종료합니다.'
      "
      class="mt-1 text-xs text-red-500"
    >
      "노후도락 서비스를 종료합니다."라고 정확히 입력해주세요.
    </p>
  </Modal>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AssetSummaryCardPie from '@/components/cards/AssetSummaryCardPie.vue';
import Btn from '@/components/buttons/Btn.vue';
import { retirement } from '../nohoo/_dummy';
import Modal from '@/components/modals/Modal.vue';

const router = useRouter();

const showModal = ref(false);
const confirmText = ref('');

const cancelModal = () => {
  confirmText.value = '';
  showModal.value = false;
};

const confirmWithdrawal = () => {
  if (confirmText.value === '노후도락 서비스를 종료합니다.') {
    // 실제 탈퇴 로직 작성
    showModal.value = false;
    confirmText.value = '';
  }
};

const menuItems = ref([
  { id: 'asset', title: '자산 추가 등록·수정' },
  { id: 'calculation', title: '자산 재연동' },
  { id: 'investment-reset', title: '투자 성향 재설정' },
  { id: 'revenue', title: '내 지점 수정' },
]);

const handleMenuClick = (menuId) => {
  switch (menuId) {
    case 'asset':
      router.push({ name: 'edit-asset' }); // 자산 추가 등록·수정
      break;
    case 'calculation':
      // 재연동 flow임을 표시하는 쿼리 파라미터 추가
      // name: 'asset-start'로 통일
      router.push({
        name: 'asset-start',
        query: { from: 'profile' },
      });
      break;
    case 'revenue':
      router.push({
        name: 'edit-branch',
      });
      break;
    case 'investment-reset':
      router.push({
        name: 'asset-custom-quiz',
        query: { from: 'profile' },
      });
      break;
  }
};

const handleLogout = () => {
  // 로그아웃 로직 추가
  console.log('로그아웃');
};
</script>
