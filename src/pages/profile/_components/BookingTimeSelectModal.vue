<template>
  <div>
    <!-- 시간 선택 -->
    <div class="mt-4">
      <h3 class="text-primary-300 mb-2 text-base font-semibold">시간 선택</h3>
      
      <div class="grid grid-cols-4 gap-2 text-sm">
        <Btn
          v-for="time in businessHours"
          :key="time"
          :label="time"
          size="small"
          :color="selectedTime === time ? 'primary' : 'surface'"
          :class="[
            'w-full',
            selectedTime === time ? 'bg-primary-300 text-white' : '',
          ]"
          @click="handleTimeClick(time)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineExpose } from 'vue';
import Btn from '@/components/buttons/Btn.vue';

interface Props {
  currentTime: string;
}

const props = defineProps<Props>();

// 컴포넌트 외부로 이벤트 전달
const emit = defineEmits<{
  (e: 'select', time: string): void;
  (e: 'close'): void;
}>();

const selectedTime = ref<string>(props.currentTime);

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

// 예약 수정 시 현재 시간 이후만 선택 가능한 시간 계산 (주석처리)
// const availableTimes = computed(() => {
//   const now = new Date();
//   
//   return businessHours.map((time) => {
//     const [hour, minute] = time.split(':').map(Number);
//     const timeDate = new Date();
//     timeDate.setHours(hour, minute, 0, 0);

//     // 현재 시간 이후만 선택 가능
//     const isPast = timeDate <= now;
//     
//     return { 
//       time, 
//       isDisabled: isPast 
//     };
//   });
// });

// 시간 클릭 핸들러
const handleTimeClick = (time: string) => {
  console.log('BookingTimeSelectModal - 시간 클릭됨:', time);
  selectedTime.value = time;
  emit('select', time);
};

// 선택된 시간 제출
const submitSelection = () => {
  if (!selectedTime.value) {
    alert('시간을 선택해주세요!');
    return;
  }

  emit('select', selectedTime.value);
  emit('close');
};

// 컴포넌트 외부로 선택된 시간 제출 함수 노출
defineExpose({
  submitSelection,
});
</script>