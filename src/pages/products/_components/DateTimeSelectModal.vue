<template>
  <div>
    <!-- 날짜 선택 -->
    <h3 class="text-primary-300 mb-2 text-base font-semibold"> 날짜 선택 </h3>
    <div class="flex w-full justify-center">
      <VCalendar
        is-expanded
        :attributes="calendarAttributes"
        :min-date="today"
        :max-date="maxDate"
        @dayclick="onDayClick"
      />
    </div>

    <!-- 시간 선택 -->
    <div v-if="selectedDate" class="mt-8">
      <h3 class="text-primary-300 mb-2 text-base font-semibold"> 시간 선택 </h3>

      <div
        v-if="availableTimes.length > 0"
        class="grid grid-cols-4 gap-2 text-sm"
      >
        <Btn
          v-for="{ time, isReserved } in availableTimes"
          :key="time"
          :label="time"
          size="small"
          :disabled="isReserved"
          :color="selectedTime === time ? 'primary' : 'surface'"
          :class="[
            'w-full',
            selectedTime === time ? 'bg-primary-300 text-white' : '',
            isReserved ? 'cursor-not-allowed opacity-40' : '',
          ]"
          @click="!isReserved && (selectedTime = time)"
        />
      </div>
    </div>

    <div v-else class="mt-4 text-center text-red-300">
      선택 가능한 시간이 없습니다.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineExpose } from 'vue';
import { Calendar as VCalendar } from 'v-calendar';
import 'v-calendar/style.css';
import Btn from '@/components/buttons/Btn.vue';
import { useRegisterStore } from '@/stores/register';

const registerStore = useRegisterStore();

// 컴포넌트 외부로 이벤트 전달
const emit = defineEmits<{
  (e: 'select', payload: { date: string; time: string }): void;
  (e: 'close'): void;
}>();

// 예약 가능 범위 설정
const today = new Date();
today.setHours(0, 0, 0, 0);

const maxDate = new Date(today);
maxDate.setDate(today.getDate() + 30);

const selectedDate = ref<Date | null>(null);
const selectedTime = ref<string | null>(null);

// 현재 날짜 선택
onMounted(() => {
  selectedDate.value = new Date();
});

const businessHours = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
];

// 예약된 시간 데이터
const reservedSlots = computed(() => registerStore.reservedSlots);

// 선택된 날짜의 예약 가능 시간 계산
const availableTimes = computed(() => {
  if (!selectedDate.value) return [];

  const dateStr = formattedDate(selectedDate.value);
  const reserved = reservedSlots.value[dateStr] || [];

  const now = new Date();
  const isToday = selectedDate.value.toDateString() === now.toDateString();

  return businessHours.map((time) => {
    const [hour, minute] = time.split(':').map(Number);
    const timeDate = new Date(selectedDate.value!);
    timeDate.setHours(hour, minute, 0, 0);

    // 오늘 날짜의 경우 현재 시간 이후만 선택 가능
    const isPast = isToday && timeDate <= now;
    const isReserved = reserved.includes(time) || isPast;

    return { time, isReserved };
  });
});

// 캘린더 속성 설정
const calendarAttributes = computed(() => [
  {
    key: 'today',
    highlight: {
      color: 'oklch(0.5495 0.1202 251.83)',
      fillMode: 'light' as const,
    },
    dates: [today],
  },
  {
    key: 'selected',
    highlight: {
      color: 'oklch(0.5495 0.1202 251.83)',
      fillMode: 'solid' as const,
    },
    dates: selectedDate.value ? [selectedDate.value] : [],
  },
]);

// 날짜 클릭 이벤트 핸들러
const onDayClick = (day: any) => {
  selectedDate.value = day.date;
  selectedTime.value = null;
};

// 날짜를 YYYY-MM-DD 형식으로 포맷팅
const formattedDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 선택된 날짜와 시간 제출
const submitSelection = async () => {
  if (!selectedDate.value || !selectedTime.value) {
    alert('날짜와 시각을 모두 선택해주세요!');
    return;
  }

  const selected = formattedDate(selectedDate.value);
  const time = selectedTime.value;

  // 예약 가능 여부 확인
  const reserved = reservedSlots.value[selected] || [];
  const isStillAvailable = !reserved.includes(time);

  if (!isStillAvailable) {
    alert('이미 예약된 시간입니다. 다른 시간을 선택해주세요.');
    return;
  }

  emit('select', {
    date: selected,
    time,
  });
  emit('close');
};

// 컴포넌트 외부로 선택된 날짜와 시간 제출 함수 노출
defineExpose({
  submitSelection,
});
</script>
