<template>
  <div>
    <!-- 날짜 선택 -->
    <h3 class="text-primary-500 mb-2 font-semibold"> 날짜 선택 </h3>
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
      <h3 class="text-primary-500 mb-2 font-semibold"> 시간 선택 </h3>

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
          @click="!isReserved && (selectedTime = time)"
        />
      </div>
    </div>

    <div v-else class="mt-4 text-center text-red-300">
      선택 가능한 시간이 없습니다.
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
import { useRegisterStore } from '@/stores/register';

const registerStore = useRegisterStore();
const emit = defineEmits<{
  (e: 'select', payload: { date: string; time: string }): void;
  (e: 'close'): void;
}>();

// Alert 상태
const showAlert = ref(false);
const alertTitle = ref<string | undefined>(undefined);
const alertMessage = ref('');
const openAlert = (message: string, title?: string) => {
  alertMessage.value = message;
  alertTitle.value = title;
  showAlert.value = true;
};
const closeAlert = () => {
  showAlert.value = false;
};

// 예약 가능 범위
const today = new Date();
today.setHours(0, 0, 0, 0);

const maxDate = new Date(today);
maxDate.setDate(today.getDate() + 30);

const selectedDate = ref<Date | null>(null);
const selectedTime = ref<string | null>(null);

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

const reservedSlots = computed(() => registerStore.reservedSlots);

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
    const isPast = isToday && timeDate <= now;
    const isReserved = reserved.includes(time) || isPast;
    return { time, isReserved };
  });
});

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

const onDayClick = (day: any) => {
  selectedDate.value = day.date;
  selectedTime.value = null;
};

const formattedDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const submitSelection = async () => {
  if (!selectedDate.value || !selectedTime.value) {
    openAlert('날짜와 시각을 모두 선택해주세요!', '입력 안내');
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
};

defineExpose({ submitSelection });
</script>
