<template>
  <div>
    <div class="mb-2 flex items-end justify-between">
      <span class="text-primary-500 text-lg font-semibold">{{ title }}</span>
      <span v-if="explain" class="text-surface-300">{{ explain }}</span>
    </div>

    <!-- 날짜 타입: 화면엔 포맷된 텍스트, 실제 변경은 숨겨진 date input -->
    <template v-if="type === 'date'">
      <!-- 표시용 -->
      <InputBox
        :modelValue="formattedDisplay"
        :placeholder="placeholder"
        size="large"
        type="text"
        readonly
        @focus="openNativePicker"
        class="cursor-pointer"
      />
      <!-- 실제 값 변경용 (숨김) -->
      <input
        ref="nativeDate"
        type="date"
        class="sr-only"
        :value="modelValue"
        @change="onNativeChange"
      />
    </template>

    <!-- 나머지 타입 -->
    <template v-else>
      <InputBox
        :modelValue="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
        :placeholder="placeholder"
        size="large"
        :type="type"
        :readonly="readOnly"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import InputBox from '@/components/forms/InputBox.vue';

const props = defineProps<{
  title: string;
  explain?: string;
  modelValue: string; // 내부 값은 YYYY-MM-DD 유지
  type?: 'text' | 'password' | 'number' | 'date' | 'time';
  placeholder?: string;
  readOnly?: boolean;
  displayFormatter?: (v: string) => string; // 화면 표시용 포맷터 (선택)
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void;
}>();

const nativeDate = ref<HTMLInputElement | null>(null);

const formattedDisplay = computed(() => {
  // date 타입이면 포맷터 적용, 아니면 원본
  if (props.type === 'date') {
    return props.displayFormatter
      ? props.displayFormatter(props.modelValue)
      : props.modelValue;
  }
  return props.modelValue;
});

function openNativePicker() {
  nativeDate.value?.showPicker?.(); // 지원 브라우저
  nativeDate.value?.click(); // 폴백
}

function onNativeChange(e: Event) {
  const v = (e.target as HTMLInputElement).value; // YYYY-MM-DD
  emit('update:modelValue', v);
}
</script>
