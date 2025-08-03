<template>
  <div class="flex justify-center">
    <div class="border-secondary-300 w-4/5 rounded-lg border p-4">
      <div class="text-secondary-500 mb-2 text-lg font-semibold">
        예약하신 방문 내용을 확인하세요
      </div>
      <div class="text-surface-500 space-y-1">
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
    </div></div
  >
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { BookingItem } from '@/api/profile/profile';

const props = defineProps<{
  booking: BookingItem;
}>();

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
</script>
