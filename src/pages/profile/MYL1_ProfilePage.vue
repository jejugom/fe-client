<template>
  <div v-if="loading" class="flex h-64 items-center justify-center">
    <div class="text-lg">데이터를 불러오는 중...</div>
  </div>

  <div v-else class="space-y-16">
    <!-- 최신예약 1개 출력 -->
    <div v-if="bookingItems.length > 0">
      <div class="text-primary-500 mb-4 text-2xl font-bold"
        >예약 일정이 곧 다가와요!</div
      >
      <RegisterCard :booking="bookingItems[0]" @updated="refreshMyPageData" />
    </div>

    <!-- 예약이 없는 경우 -->
    <div v-else class="py-8 text-center text-gray-500">
      예약 내역이 없습니다.
    </div>

    <div class="space-y-4">
      <div class="text-primary-500 mb-4 text-2xl font-bold"
        >내 자산 확인하기</div
      >
      <AssetRankCard
        :userName="userName"
        :assetAmount="assetAmount"
        :rankPercent="rankPercent"
        :investmentRatio="investmentRatio"
      />
      <AssetSummaryCardPie
        :userName="userName"
        :assetAmount="assetAmount"
        :assetInfo="assetSummary"
      />
      <Btn
        color="primary"
        label="전체 자산 목록 확인하기"
        size="large"
        @click="router.push({ name: 'edit-asset' })"
        class="mt-[-0.5rem]"
      />
    </div>

    <div class="flex flex-col items-start gap-4">
      <div class="text-primary-500 text-2xl font-bold">전체 메뉴</div>
      <div class="card-design flex w-full flex-col gap-4">
        <MenuBtn
          v-for="menu in menuItems"
          :key="menu.id"
          color="surface"
          size="small"
          :label="menu.title"
          @click="handleMenuClick(menu.id)"
        />
      </div>
    </div>
  </div>

  <!-- 탈퇴 모달 -->
  <Modal
    v-if="showModal"
    @click1="cancelModal"
    @click2="confirmWithdrawal"
    title="정말 탈퇴하시겠습니까?"
    leftLabel="아니오"
    rightLabel="예"
    :rightDisabled="confirmText.trim() !== CONFIRM_PHRASE"
  >
    <p class="text-surface-500 mb-4 text-center text-xs">
      탈퇴를 원하신다면 아래 입력창에<br />
      <strong>{{ CONFIRM_PHRASE }}</strong
      >를 입력해주세요.
    </p>
    <InputBox
      v-model="confirmText"
      :placeholder="CONFIRM_PHRASE"
      size="medium"
      type="text"
    />
    <p
      v-if="showModal && confirmText && confirmText.trim() !== CONFIRM_PHRASE"
      class="mt-1 text-xs text-red-300"
    >
      "{{ CONFIRM_PHRASE }}"라고 정확히 입력해주세요.
    </p>
  </Modal>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

import AssetSummaryCardPie from '@/components/cards/AssetSummaryCardPie.vue';
import AssetRankCard from './_components/AssetRankCard.vue';
import RegisterCard from './_components/RegisterCard.vue';
import MenuBtn from './_components/MenuBtn.vue';
import Btn from '@/components/buttons/Btn.vue';
import Modal from '@/components/modals/Modal.vue';
import InputBox from '@/components/forms/InputBox.vue';

import { mypageApi } from '@/api/user/mypage';
import { getAssetCategoryName } from '@/utils/format';
import {
  getBranchNameById,
  getProductNameByCodeWrapper,
} from '@/utils/bookingMapper';

const CONFIRM_PHRASE = '노후도락 서비스를 종료합니다';

const myPageData = ref(null);
const loading = ref(true);

const userName = computed(() => myPageData.value?.userInfo?.userName || '');

/**
 * 자산 카테고리별 요약 데이터
 */
const assetSummary = computed(() => {
  if (!myPageData.value?.userInfo?.assetStatus) return [];

  // console.log('Raw asset data:', myPageData.value.userInfo.assetStatus);

  return myPageData.value.userInfo.assetStatus.map((asset) => {
    const category = getAssetCategoryName(asset.assetCategoryCode);
    // console.log(`Mapping ${asset.assetCategoryCode} -> ${category}`);
    return {
      category,
      amount: asset.amount,
    };
  });

  // console.log('Mapped asset data:', mapped);
});

/**
 * 총 자산 금액
 */
const assetAmount = computed(() =>
  assetSummary.value.reduce((total, asset) => total + asset.amount, 0)
);

/**
 * 자산 순위 백분율
 */
const rankPercent = computed(() => myPageData.value?.assetPercentile ?? 0);
const investmentRatio = ref(61);

const router = useRouter();
const authStore = useAuthStore();

const showModal = ref(false);
const confirmText = ref('');

/**
 * 탈퇴 모달 취소
 */
function cancelModal() {
  confirmText.value = '';
  showModal.value = false;
}

/**
 * 회원 탈퇴 실행
 */
async function confirmWithdrawal() {
  if (confirmText.value.trim() !== CONFIRM_PHRASE) return;

  try {
    await mypageApi.deleteMe();
    showModal.value = false;
    confirmText.value = '';
    authStore.logout();
    router.replace({ name: 'home' });
  } catch (e) {
    // console.error('탈퇴 실패:', e);
    alert('탈퇴 처리에 실패했어요. 잠시 후 다시 시도해주세요.');
  }
}

const menuItems = ref([
  { id: 'profile', title: '내 정보 고치기' },
  { id: 'register', title: '내 예약 내역 확인 및 고치기' },
  { id: 'revenue', title: '내 은행 지점 바꾸기' },
  { id: 'calculation', title: '내 자산 자동 연결하기' },
  { id: 'investment-reset', title: '내 투자 성향 선택하기' },
  { id: 'asset', title: '내 자산 고치기' },
  { id: 'tutorial', title: '사용 방법 보기' },
  { id: 'logout', title: '로그아웃' },
  { id: 'withdrawal', title: '회원 탈퇴' },
]);

/**
 * 메뉴 클릭 처리
 */
function handleMenuClick(menuId) {
  switch (menuId) {
    case 'asset':
      router.push({ name: 'edit-asset' });
      break;
    case 'calculation':
      router.push({ name: 'asset-kookmin-login', query: { from: 'profile' } });
      break;
    case 'revenue':
      router.push({
        name: 'edit-branch',
        query: { from: 'profile' },
      });
      break;
    case 'investment-reset':
      router.push({ name: 'asset-custom-quiz', query: { from: 'profile' } });
      break;
    case 'tutorial':
      router.push({ name: 'asset-tutorial' });
      break;
    case 'logout':
      authStore.logout();
      router.push({ name: 'home' });
      break;
    case 'withdrawal':
      showModal.value = true;
      break;
    case 'register':
      router.push({ name: 'register-list' });
      break;
    case 'profile':
      router.push({ name: 'edit-profile' });
      break;
    default:
      // console.warn(`Unknown menu item: ${menuId}`);
      break;
  }
}

/**
 * 예약 데이터를 RegisterCard 컴포넌트 형식으로 변환
 */
function transformBookingData(bookingInfo) {
  return bookingInfo.map((booking) => {
    const date = new Date(booking.date);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    
    return {
      id: booking.bookingId,
      date: `${yyyy}-${mm}-${dd}`,
      time: booking.time,
      bank_name: getBranchNameById(booking.branchId),
      prdt_name: getProductNameByCodeWrapper(booking.finPrdtCode),
      branchId: booking.branchId,
      finPrdtCode: booking.finPrdtCode,
    };
  });
}

/**
 * 변환된 예약 목록 (백엔드에서 시간순 정렬됨)
 */
const bookingItems = computed(() => {
  const list = myPageData.value?.bookingInfo || [];
  return transformBookingData(list);
});

/**
 * 마이페이지 데이터 로드
 */
async function fetchMyPageData() {
  try {
    loading.value = true;
    myPageData.value = await mypageApi.getMyPageData();
  } catch (error) {
    // console.error('마이페이지 데이터 로딩 실패:', error);
  } finally {
    loading.value = false;
  }
}

/**
 * 예약 수정/삭제 후 데이터 새로고침
 */
async function refreshMyPageData() {
  await fetchMyPageData();
}

onMounted(() => {
  fetchMyPageData();
});
</script>
