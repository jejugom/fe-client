<template>
  <div v-if="loading" class="flex h-64 items-center justify-center">
    <div class="text-lg">데이터를 불러오는 중...</div>
  </div>

  <div v-else class="space-y-16">
    <!-- Info Box -->
    <!-- 예약 내역이 2개 이상일 때는 슬라이드로 보여주기 -->
    <Carousel v-if="bookingItems.length > 1" :items="bookingItems">
      <template #default="{ item }">
        <RegisterCard :booking="item" />
      </template>
    </Carousel>

    <!-- 예약이 1개뿐일 때는 일반 렌더링 -->
    <div v-else-if="bookingItems.length === 1">
      <RegisterCard :booking="bookingItems[0]" />
    </div>

    <!-- 예약 내역이 없을 때 -->
    <div v-else class="py-8 text-center text-gray-500">
      예약 내역이 없습니다.
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
    <div
      class="text-surface-300 mt-4 flex items-center justify-end gap-4 text-sm"
    >
      <div class="text-primary-300 cursor-pointer" @click="">사용방법 보기</div>
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
import InputBox from '@/components/forms/InputBox.vue';

const myPageData = ref(null);
const loading = ref(true);

const userName = computed(() => myPageData.value?.userInfo.userName || '');
const assetAmount = computed(() => {
  if (!myPageData.value?.userInfo.assetStatus) return 0;
  return myPageData.value.userInfo.assetStatus.reduce(
    (total, asset) => total + asset.amount,
    0
  );
});

// 자산 카테고리 코드를 프론트엔드 형식으로 변환
const assetInfo = computed(() => {
  // API 데이터가 로드되지 않았을 때 임시 더미 데이터로 차트 테스트
  if (!myPageData.value?.userInfo.assetStatus) {
    console.log('API 데이터 없어서 더미 데이터 사용');
    return {
      total: 195000000,
      real_estate: 150000000,
      deposit: 35000000,
      cash: 5000000,
      stock_fund: 3000000,
      business_equity: 2000000,
      etc: 0,
    };
  }

  console.log('API 데이터:', myPageData.value.userInfo.assetStatus);

  const assetMap = myPageData.value.userInfo.assetStatus.reduce(
    (acc, asset) => {
      acc[asset.assetCategoryCode] = asset.amount;
      return acc;
    },
    {}
  );

  console.log('변환된 자산 맵:', assetMap);

  // 현재 백엔드에서 오는 카테고리 코드에 따라 매핑
  const result = {
    total: assetAmount.value,
    real_estate: assetMap['1'] || assetMap[1] || 0, // 카테고리 1: 부동산
    deposit: assetMap['2'] || assetMap[2] || 0, // 카테고리 2: 예적금
    cash: assetMap['3'] || assetMap[3] || 0, // 카테고리 3: 현금 ✓
    stock_fund: assetMap['4'] || assetMap[4] || 0, // 카테고리 4: 주식/펀드 ✓
    business_equity: assetMap['5'] || assetMap[5] || 0, // 카테고리 5: 사업지분 ✓
    etc: assetMap['6'] || assetMap[6] || 0, // 카테고리 6: 기타
  };

  console.log('최종 자산 정보:', result);
  return result;
});

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
  // auth store의 로그아웃 함수 호출
  authStore.logout();
  // 홈페이지로 리다이렉트
  router.push({ name: 'home' });
};

const bookingItems = computed(() => {
  if (!myPageData.value?.bookingInfo) return [];

  return myPageData.value.bookingInfo.map((booking) => ({
    id: booking.bookingId,
    date: new Date(booking.date).toISOString().split('T')[0], // timestamp를 YYYY-MM-DD 형식으로 변환
    time: booking.time,
    bank_name: '국민은행', // 백엔드에서 지점명 조회 필요시 추가 API 호출 필요
    prdt_name: booking.finPrdtCode, // 상품명 조회 필요시 추가 API 호출 필요
  }));
});

// 페이지 로드시 데이터 가져오기
const loadMyPageData = async () => {
  try {
    loading.value = true;
    myPageData.value = await mypageApi.getMyPageData();
  } catch (error) {
    console.error('마이페이지 데이터 로드 실패:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadMyPageData();
});

// API 데이터로 렌더링 완료
</script>
