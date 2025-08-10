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
        <span class="font-semibold">방문 장소 :</span> {{ booking.bank_name }}
      </div>
      <div>
        <span class="font-semibold">상담 내용 :</span> {{ booking.prdt_name }}
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
      방문 시간 변경
    </div>

    <BookingTimeSelectModal
      ref="timeModalRef"
      :currentTime="booking.time"
      @close="showTimeModal = false"
      @select="handleTimeSelect"
    />
  </Modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { BookingItem } from '@/api/profile/profile';

import ArrowIcon from '@/assets/icons/Arrow45.svg';

import Btn from '@/components/buttons/Btn.vue';
import Modal from '@/components/modals/Modal.vue';
import BookingTimeSelectModal from './BookingTimeSelectModal.vue';
import { mypageApi } from '@/api/user/mypage';
import TextBtn from '@/components/buttons/TextBtn.vue';

const props = defineProps<{
  booking: BookingItem;
}>();

const emit = defineEmits<{
  (e: 'updated'): void;
}>();

const showTimeModal = ref(false);
const selectedTime = ref<string | null>(null);
const timeModalRef = ref<InstanceType<typeof BookingTimeSelectModal> | null>(
  null
);

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

// 시간 선택 처리
const handleTimeSelect = (time: string) => {
  console.log('시간 선택됨:', time);
  selectedTime.value = time;
};

// 시간 변경 제출
const submitTimeChange = async () => {
  console.log('submitTimeChange 호출됨, selectedTime:', selectedTime.value);

  if (!selectedTime.value) {
    alert('시간을 선택해주세요!');
    return;
  }

  try {
    console.log('API 호출 시작:', props.booking.id, {
      date: props.booking.date,
      time: selectedTime.value,
    });

    await mypageApi.updateBooking(props.booking.id, {
      date: props.booking.date,
      time: selectedTime.value,
    });

    showTimeModal.value = false;
    selectedTime.value = null;
    emit('updated');
    alert('예약 시간이 성공적으로 변경되었습니다.');
  } catch (error) {
    console.error('예약 시간 변경 실패:', error);
    alert('예약 시간 변경 중 오류가 발생했습니다.');
  }
};

// 예약 삭제 처리
const handleBookingDelete = async () => {
  if (confirm('정말 예약을 삭제하시겠습니까?')) {
    try {
      await mypageApi.deleteBooking(props.booking.id);

      showTimeModal.value = false;
      emit('updated');
      alert('예약이 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('예약 삭제 실패:', error);
      alert('예약 삭제 중 오류가 발생했습니다.');
    }
  }
};
</script>
