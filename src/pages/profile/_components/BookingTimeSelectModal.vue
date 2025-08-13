<template>
  <div>
    <!-- 날짜 선택 -->
    <h3 class="text-primary-500 mb-2 font-semibold">날짜 선택</h3>
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
      <h3 class="text-primary-500 mb-2 font-semibold">시간 선택</h3>

      <div v-if="availableTimes.length > 0" class="grid grid-cols-4 gap-2">
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
          @click="!isReserved && handleTimeClick(time)"
        />
      </div>
      <div v-else class="mt-4 text-center text-red-300">
        선택 가능한 시간이 없습니다.
      </div>
    </div>
  </div>

  <Alert v-if="showAlert" :title="alertTitle" @click="closeAlert">
    <p class="text-center whitespace-pre-line">{{ alertMessage }}</p>
  </Alert>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineExpose } from 'vue';
import { Calendar as VCalendar } from 'v-calendar';
import 'v-calendar/style.css';
import Btn from '@/components/buttons/Btn.vue';
import Alert from '@/components/modals/Alert.vue';
import { fetchReservedSlots } from '@/api/products/register';

interface Props {
  currentTime: string;
  currentDate: string;
  branchId: number;
}

const props = defineProps<Props>();

// 컴포넌트 외부로 이벤트 전달
const emit = defineEmits<{
  (e: 'select', payload: { date: string; time: string }): void;
  (e: 'close'): void;
}>();

/**
 * Alert 모달 상태 및 제어
 */
const showAlert = ref(false);
const alertTitle = ref<string | undefined>(undefined);
const alertMessage = ref('');

function openAlert(message: string, title?: string) {
  alertMessage.value = message;
  alertTitle.value = title;
  showAlert.value = true;
}

function closeAlert() {
  showAlert.value = false;
}

/**
 * 예약 가능 범위 (오늘부터 30일 후까지)
 */
const today = new Date();
today.setHours(0, 0, 0, 0);

const maxDate = new Date(today);
maxDate.setDate(today.getDate() + 30);

const selectedDate = ref<Date | null>(null);
const selectedTime = ref<string | null>(props.currentTime);
const reservedSlots = ref<Record<string, string[]>>({});

/**
 * 컴포넌트 초기화
 */
onMounted(async () => {
  const currentDate = new Date(props.currentDate);
  selectedDate.value = currentDate;

  try {
    const res = await fetchReservedSlots(props.branchId);
    const slots = res?.reserved_slots ?? {};
    // console.log('Fetched reserved slots:', slots);
    reservedSlots.value = slots;
  } catch (error) {
    // console.error('Failed to fetch reserved slots:', error);
  }
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

/**
 * 예약 가능한 시간 목록 (과거 시간 및 예약된 시간 제외)
 */
const availableTimes = computed(() => {
  if (!selectedDate.value) return [];
  const dateStr = formattedDate(selectedDate.value);
  const reserved = reservedSlots.value[dateStr] || [];
  const now = new Date();
  const isToday = selectedDate.value.toDateString() === now.toDateString();

  // console.log('Computing available times for date:', dateStr);
  // console.log('Reserved slots for this date:', reserved);
  // console.log('Is today:', isToday);

  return businessHours.map((time) => {
    const [hour, minute] = time.split(':').map(Number);
    const timeDate = new Date(selectedDate.value!);
    timeDate.setHours(hour, minute, 0, 0);
    const isPast = isToday && timeDate <= now;
    const isReserved = reserved.includes(time) || isPast;

    // if (isReserved) {
    //   console.log(`Time ${time} is reserved or past:`, { isPast, reservedIncludes: reserved.includes(time) });
    // }

    return { time, isReserved };
  });
});

/**
 * 캘린더 표시 속성 (오늘 및 선택된 날짜 하이라이트)
 */
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

/**
 * 날짜 선택 처리
 */
const onDayClick = async (day: any) => {
  const previousDate = selectedDate.value;
  selectedDate.value = day.date;

  const isSameDate =
    previousDate && previousDate.toDateString() === day.date.toDateString();

  if (!isSameDate) {
    selectedTime.value = null;
  }

  // console.log('Date clicked:', day.date);
  // console.log('Same date?', isSameDate);
  // console.log('Selected time after date change:', selectedTime.value);

  try {
    const res = await fetchReservedSlots(props.branchId);
    const slots = res?.reserved_slots ?? {};
    // console.log('Updated reserved slots for new date:', slots);
    reservedSlots.value = slots;
  } catch (error) {
    // console.error('Failed to fetch reserved slots for new date:', error);
  }
};

/**
 * 날짜 포맷팅 (YYYY-MM-DD)
 */
function formattedDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 시간 선택 처리
 */
function handleTimeClick(time: string) {
  // console.log('Time clicked:', time);
  selectedTime.value = time;
  // console.log('Selected time set to:', selectedTime.value);
}

/**
 * 선택된 날짜/시간 검증 및 제출
 */
function submitSelection() {
  // console.log('Submit called - selectedDate:', selectedDate.value);
  // console.log('Submit called - selectedTime:', selectedTime.value);

  if (!selectedDate.value || !selectedTime.value) {
    // console.log('Validation failed - missing date or time');
    openAlert('날짜와 시간을 모두 선택해주세요!', '입력 안내');
    return;
  }

  const selected = formattedDate(selectedDate.value);
  const time = selectedTime.value;
  const reserved = reservedSlots.value[selected] || [];
  const isStillAvailable = !reserved.includes(time);

  if (!isStillAvailable) {
    openAlert('이미 예약된 시간입니다. 다른 시간을 선택해주세요.', '예약 실패');
    return;
  }

  emit('select', { date: selected, time });
  emit('close');
}

// 컴포넌트 외부로 선택된 시간 제출 함수 노출
defineExpose({
  submitSelection,
});
</script>
