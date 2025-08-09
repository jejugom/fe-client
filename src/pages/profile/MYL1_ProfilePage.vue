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
      <RegisterCard :booking="bookingItems[0]" />
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
        class="mt-[-8px]"
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
  <Modal
    v-if="showModal"
    @click1="cancelModal"
    @click2="confirmWithdrawal"
    title="정말 탈퇴하시겠습니까?"
    leftLabel="아니오"
    rightLabel="예"
    :rightDisabled="confirmText !== '노후도락 서비스를 종료합니다'"
  >
    <p class="text-surface-500 mb-4 text-center text-xs">
      탈퇴를 원하신다면 아래 입력창에<br />
      <strong>"노후도락 서비스를 종료합니다"</strong>를 입력해주세요.
    </p>
    <InputBox
      v-model="confirmText"
      placeholder="노후도락 서비스를 종료합니다"
      size="medium"
      type="text"
    />
    <p
      v-if="
        showModal &&
        confirmText &&
        confirmText !== '노후도락 서비스를 종료합니다'
      "
      class="mt-1 text-xs text-red-300"
    >
      "노후도락 서비스를 종료합니다"라고 정확히 입력해주세요.
    </p>
  </Modal>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import AssetSummaryCardPie from '@/components/cards/AssetSummaryCardPie.vue';
import Btn from '@/components/buttons/Btn.vue';
import Modal from '@/components/modals/Modal.vue';
import Carousel from '@/components/carousel/Carousel.vue';
import RegisterCard from './_components/RegisterCard.vue';
import { mypageApi } from '@/api/user/mypage';
import { getAssetCategoryName } from '@/utils/format';
import InputBox from '@/components/forms/InputBox.vue';
import AssetRankCard from './_components/AssetRankCard.vue';
import MenuBtn from './_components/MenuBtn.vue';

const myPageData = ref(null);
const loading = ref(true);

const userName = computed(() => {
  return myPageData.value?.userInfo?.userName || '';
});

const assetSummary = computed(() => {
  if (!myPageData.value?.userInfo?.assetStatus) return [];

  console.log('Raw asset data:', myPageData.value.userInfo.assetStatus);

  const mapped = myPageData.value.userInfo.assetStatus.map((asset) => {
    const category = getAssetCategoryName(asset.assetCategoryCode);
    console.log(`Mapping ${asset.assetCategoryCode} -> ${category}`);
    return {
      category,
      amount: asset.amount,
    };
  });

  console.log('Mapped asset data:', mapped);
  return mapped;
});

const assetAmount = computed(() => {
  return assetSummary.value.reduce((total, asset) => total + asset.amount, 0);
});

const rankPercent = computed(() => {
  return myPageData.value?.assetPercentile || 0;
});
const investmentRatio = ref(61);

const router = useRouter();
const authStore = useAuthStore();

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
  { id: 'profile', title: '내 정보 고치기' },
  { id: 'revenue', title: '내 은행 지점 바꾸기' },
  { id: 'investment-reset', title: '내 투자 성향 다시 선택하기' },
  { id: 'asset', title: '내 자산 고치기' },
  { id: 'register', title: '예약 내역 확인 및 수정하기' },
  { id: 'calculation', title: '자산 다시 연결하기' },
  { id: 'tutorial', title: '사용 방법 보기' },
  { id: 'logout', title: '로그아웃' },
  { id: 'withdrawal', title: '회원 탈퇴' },
]);

const handleMenuClick = (menuId) => {
  switch (menuId) {
    case 'asset':
      router.push({ name: 'edit-asset' }); // 자산 추가 등록·수정
      break;
    case 'calculation':
      router.push({
        name: 'asset-kookmin-login',
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
    case 'tutorial':
      router.push({
        name: 'asset-tutorial',
      });
      break;
    case 'logout':
      handleLogout();
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
      console.warn(`Unknown menu item: ${menuId}`);
      break;
  }
};

const handleLogout = () => {
  // auth store의 로그아웃 함수 호출
  authStore.logout();
  // 홈페이지로 리다이렉트
  router.push({ name: 'home' });
};

// Transform booking data from API to match RegisterCard expectations
const transformBookingData = (bookingInfo) => {
  return bookingInfo.map((booking) => {
    const date = new Date(booking.date);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    return {
      id: booking.bookingId,
      date: formattedDate,
      time: booking.time,
      bank_name: `지점 ID: ${booking.branchId}`, // TODO: 실제 지점명으로 변환 필요
      prdt_name: booking.finPrdtCode, // TODO: 실제 상품명으로 변환 필요
    };
  });
};

const bookingItems = computed(() => {
  if (!myPageData.value?.bookingInfo) return [];
  return transformBookingData(myPageData.value.bookingInfo);
});

onMounted(async () => {
  try {
    loading.value = true;
    myPageData.value = await mypageApi.getMyPageData();
  } catch (error) {
    console.error('마이페이지 데이터 로딩 실패:', error);
    // TODO: 에러 처리 로직 추가
  } finally {
    loading.value = false;
  }
});
</script>
