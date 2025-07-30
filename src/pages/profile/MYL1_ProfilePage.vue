<template>
  <div class="space-y-16">
    <!-- Info Box -->
    <!-- 예약 내역이 2개 이상일 때는 슬라이드로 보여주기 -->
    <Carousel v-if="bookingItems.length > 1" :items="bookingItems">
      <template #default="{ item }">
        <RegisterCard :booking="item" />
      </template>
    </Carousel>

    <!-- 예약이 1개뿐일 때는 일반 렌더링 -->
    <div v-else>
      <RegisterCard :booking="bookingItems[0]" />
    </div>

    <!-- 자산현황 파이차트 컴포넌트-->
    <AssetSummaryCardPie
      :userName="userName"
      :assetAmount="assetAmount"
      :assetInfo="assetInfo"
    />

    <!-- Menu Section -->
    <div class="flex flex-col gap-4">
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
      <div class="text-surface-500 cursor-pointer" @click="">사용방법 보기</div>
      <div class="cursor-pointer underline" @click="handleLogout">로그아웃</div>
      <p class="cursor-pointer underline" @click="showModal = true">회원탈퇴</p>
    </div>
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import AssetSummaryCardPie from '@/components/cards/AssetSummaryCardPie.vue';
import Btn from '@/components/buttons/Btn.vue';
import { api_data } from '@/api/profile/profile';
import Modal from '@/components/modals/Modal.vue';
import Carousel from '@/components/carousel/Carousel.vue';
import RegisterCard from './_components/RegisterCard.vue';

const retirement = api_data;

const userName = retirement.user_info.name;
const assetAmount = retirement.asset_info.total;
const assetInfo = retirement.asset_info;

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
  { id: 'asset', title: '내 자산 확인하고 고치기' },
  { id: 'calculation', title: '자산 다시 연결하기' },
  { id: 'investment-reset', title: '내 투자 성향 다시 선택하기' },
  { id: 'revenue', title: '내 은행 지점 바꾸기' },
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

const bookingItems = computed(() => {
  return [api_data.booking.gift_booking, api_data.booking.prdt_booking].filter(
    Boolean
  ); // null/undefined 방지
});
</script>
