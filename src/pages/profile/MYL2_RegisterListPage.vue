<template>
  <div v-if="loading" class="flex h-64 items-center justify-center">
    <div class="text-lg">예약 내역을 불러오는 중...</div>
  </div>

  <div v-else class="space-y-4">
    <div class="text-primary-500 mb-4 text-2xl font-bold">
      예약 일정이 곧 다가와요!
    </div>

    <!-- 예약 내역이 있는 경우 -->
    <div v-if="sortedBookings.length > 0" class="space-y-4">
      <RegisterCard
        v-for="booking in sortedBookings"
        :key="booking.id"
        :booking="booking"
        @updated="refreshBookingData"
      />
    </div>

    <!-- 예약 내역이 없는 경우 -->
    <div v-else class="text-primary-500 py-8 text-center font-semibold">
      예약 내역이 없습니다. 다양한 금융 상품을 예약해 보세요!
      <Btn
        color="primary"
        label="맞춤 상품 확인하기"
        size="large"
        class="mt-4"
        @click="router.push({ name: 'nohoo' })"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import RegisterCard from './_components/RegisterCard.vue';
import { mypageApi } from '@/api/user/mypage';
import Btn from '@/components/buttons/Btn.vue';
import { useRouter } from 'vue-router';
import { getBranchNameById, getProductNameByCodeWrapper } from '@/utils/bookingMapper';

const router = useRouter();

const myPageData = ref(null);
const loading = ref(true);

/**
 * 예약 데이터를 RegisterCard 컴포넌트 형식으로 변환
 */
function transformBookingData(bookingInfo) {
  return bookingInfo.map((booking) => {
    const date = new Date(booking.date);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    return {
      id: booking.bookingId,
      date: formattedDate,
      time: booking.time,
      bank_name: getBranchNameById(booking.branchId),
      prdt_name: getProductNameByCodeWrapper(booking.finPrdtCode),
      branchId: booking.branchId,
      finPrdtCode: booking.finPrdtCode,
    };
  });
}

/**
 * 변환된 예약 목록
 */
const bookingItems = computed(() => {
  if (!myPageData.value?.bookingInfo) return [];
  return transformBookingData(myPageData.value.bookingInfo);
});

/**
 * 예약 시간이 빠른 순서대로 정렬된 예약 목록
 */
const sortedBookings = computed(() => {
  return [...bookingItems.value].sort((a, b) => {
    const dateTimeA = new Date(`${a.date}T${a.time}`);
    const dateTimeB = new Date(`${b.date}T${b.time}`);
    return dateTimeA - dateTimeB;
  });
});

/**
 * 예약 데이터 로드
 */
async function fetchBookingData() {
  try {
    loading.value = true;
    myPageData.value = await mypageApi.getMyPageData();
  } catch (error) {
    // console.error('예약 데이터 로딩 실패:', error);
  } finally {
    loading.value = false;
  }
}

/**
 * 예약 수정/삭제 후 데이터 새로고침
 */
async function refreshBookingData() {
  await fetchBookingData();
}

onMounted(() => {
  fetchBookingData();
});
</script>
