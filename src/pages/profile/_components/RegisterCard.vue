<template>
  <div class="card-design relative">
    <!-- 우측 상단 고정 아이콘 -->
    <TextBtn
      color="surface"
      label="수정하기 ➜"
      size="small"
      class="absolute right-4 bottom-4"
      @click="showTimeModal = true"
    />

    <div class="text-surface-500 space-y-1 text-base">
      <div>
        <span class="font-semibold">방문 날짜 :</span> {{ formattedDate }}
      </div>
      <div>
        <span class="font-semibold">방문 장소 :</span> {{ displayBankName }}
      </div>
      <div>
        <span class="font-semibold">상담 내용 :</span> {{ displayProductName }}
      </div>
    </div>
  </div>

  <!-- 시간 변경 모달 -->
  <Modal
    v-if="showTimeModal"
    leftLabel="예약 삭제"
    rightLabel="변경 완료"
    @click1="handleBookingDelete"
    @click2="submitTimeChange"
  >
    <!-- X 버튼 (모달 우측 상단 고정) -->
    <button
      @click="showTimeModal = false"
      class="absolute top-3 right-5 z-10 text-2xl font-bold"
    >
      ×
    </button>

    <!-- 제목 -->
    <div class="text-primary-300 mb-4 text-center text-2xl font-bold">
      방문 날짜/시간 변경
    </div>

    <!-- 안내 문구 -->
    <div class="mb-4">
      <p class="text-center text-sm text-gray-600">
        방문지점을 바꾸고 싶으시다면
      </p>
      <p class="text-center text-sm text-gray-600">
        예약 삭제 후 다시 예약해주세요!
      </p>
    </div>

    <BookingTimeSelectModal
      ref="timeModalRef"
      :currentTime="booking.time"
      :currentDate="booking.date"
      :branchId="booking.branchId || parseInt(String(booking.bank_name), 10)"
      @close="showTimeModal = false"
      @select="handleDateTimeConfirm"
    />
  </Modal>

  <!-- 삭제 확인 모달 -->
  <Modal
    v-if="showDeleteConfirmModal"
    title="예약 삭제"
    leftLabel="아니오"
    rightLabel="예"
    @click1="showDeleteConfirmModal = false"
    @click2="confirmBookingDelete"
  >
    <p class="text-center">정말 예약을 삭제하시겠습니까?</p>
  </Modal>

  <!-- 예약 변경/삭제/오류 alert창 -->
  <Alert v-if="showAlert" @click="onAlertConfirm">
    <p>{{ alertMessage }}</p>
  </Alert>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { BookingItem } from '@/types/profile/profile';

import Modal from '@/components/modals/Modal.vue';
import Alert from '@/components/modals/Alert.vue';
import BookingTimeSelectModal from './BookingTimeSelectModal.vue';
import { mypageApi } from '@/api/user/mypage';
import TextBtn from '@/components/buttons/TextBtn.vue';
import {
  getBranchNameById,
  getProductNameByCodeWrapper,
} from '@/utils/bookingMapper';

const props = defineProps<{
  booking: BookingItem;
}>();

const emit = defineEmits<{
  (e: 'updated'): void;
}>();

const showTimeModal = ref(false);
const timeModalRef = ref<InstanceType<typeof BookingTimeSelectModal> | null>(
  null
);
const showDeleteConfirmModal = ref(false);
const showAlert = ref(false);
const alertMessage = ref('');
const isSuccessAlert = ref(false);

function onAlertConfirm() {
  showAlert.value = false;
  if (isSuccessAlert.value) {
    emit('updated');
    isSuccessAlert.value = false; // reset
  }
}

const formattedDate = computed(() => {
  const dateObj = new Date(`${props.booking.date}T${props.booking.time}`);
  if (isNaN(dateObj.getTime())) return '날짜 정보 없음';

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hour = dateObj.getHours();
  const minute = String(dateObj.getMinutes()).padStart(2, '0');
  const ampm = hour >= 12 ? '오후' : '오전';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  return `${year}년 ${month}월 ${day}일 ${ampm} ${hour12}시 ${minute}분`;
});

// 지점명과 상품명을 실제 이름으로 변환하는 computed
const displayBankName = computed(() => {
  // 1. 먼저 branchId 필드가 있는지 확인
  if (props.booking.branchId !== undefined) {
    return getBranchNameById(props.booking.branchId);
  }

  // 2. bank_name이 숫자 형태의 ID인 경우 변환
  if (
    typeof props.booking.bank_name === 'number' ||
    (typeof props.booking.bank_name === 'string' &&
      /^\d+$/.test(props.booking.bank_name))
  ) {
    return getBranchNameById(parseInt(String(props.booking.bank_name), 10));
  }

  // 3. 이미 지점명인 경우 그대로 사용
  return props.booking.bank_name || '지점 정보 없음';
});

/**
 * 상품 이름 표시 (코드를 이름으로 변환)
 */
const displayProductName = computed(() => {
  if (props.booking.finPrdtCode) {
    return getProductNameByCodeWrapper(props.booking.finPrdtCode);
  }

  if (typeof props.booking.prdt_name === 'string') {
    const codePatterns = [
      /^[0-9A-Z]{4}$/,
      /^DP\d+$/,
      /^LN\d+$/,
      /^C\d+$/,
      /^(gift|inheritance)$/,
    ];

    const isProductCode = codePatterns.some((pattern) =>
      pattern.test(props.booking.prdt_name)
    );
    if (isProductCode) {
      return getProductNameByCodeWrapper(props.booking.prdt_name);
    }
  }

  return props.booking.prdt_name || '상품 정보 없음';
});

/**
 * 날짜/시간 변경 제출 (모달 내부 검증 후 실행)
 */
function submitTimeChange() {
  timeModalRef.value?.submitSelection();
}

/**
 * 날짜/시간 변경 API 호출 (모달 검증 후 실행)
 */
async function handleDateTimeConfirm(payload: { date: string; time: string }) {
  try {
    await mypageApi.updateBooking(props.booking.id, {
      date: payload.date,
      time: payload.time,
    });

    showTimeModal.value = false;
    alertMessage.value = '예약 날짜/시간이 성공적으로 변경되었습니다.';
    isSuccessAlert.value = true;
    showAlert.value = true;
  } catch (error) {
    // console.error('예약 날짜/시간 변경 실패:', error);
    alertMessage.value = '예약 날짜/시간 변경 중 오류가 발생했습니다.';
    showAlert.value = true;
  }
}

/**
 * 예약 삭제 확인 모달 표시
 */
function handleBookingDelete() {
  showDeleteConfirmModal.value = true;
}

/**
 * 예약 삭제 API 호출
 */
async function confirmBookingDelete() {
  showDeleteConfirmModal.value = false;
  try {
    await mypageApi.deleteBooking(props.booking.id);
    showTimeModal.value = false;

    alertMessage.value = '예약이 성공적으로 삭제되었습니다.';
    isSuccessAlert.value = true;
    showAlert.value = true;
  } catch (error) {
    // console.error('예약 삭제 실패:', error);
    alertMessage.value = '예약 삭제 중 오류가 발생했습니다.';
    showAlert.value = true;
  }
}
</script>
