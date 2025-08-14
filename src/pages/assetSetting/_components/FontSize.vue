<template>
  <section class="card-design">
    <div
      class="bg-surface-100 flex h-20 items-center rounded-lg px-2"
      :style="{ fontSize: `${previewPx}px`, lineHeight: 1.6 }"
    >
      글자 크기 미리보기입니다. 한 번에 잘 읽히는지 확인해 보세요.
    </div>

    <div class="mt-4 flex flex-wrap justify-between gap-1">
      <div class="flex w-full justify-end gap-2">
        <Btn size="small" label="A-" color="surface" @click="previewDec" />
        <span class="mx-2">{{ previewPx }}px</span>
        <Btn size="small" label="A+" color="surface" @click="previewInc"
      /></div>
      <div class="flex w-full justify-end gap-2">
        <Btn
          size="small"
          color="surface"
          label="초기화"
          @click="resetPreview" />
        <Btn
          size="small"
          color="primary"
          label="설정하기"
          @click="applyPreviewToGlobal"
      /></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Btn from '@/components/buttons/Btn.vue';
import { useFontSize } from '@/utils/useFontSize';

// 옵션(필요시 변경 가능)
const props = withDefaults(
  defineProps<{
    min?: number; // 허용 최소 px
    max?: number; // 허용 최대 px
    step?: number;
  }>(),
  {
    min: 10,
    max: 20,
    step: 2,
  }
);

const emit = defineEmits<{
  (e: 'changed', value: number): void; // 미리보기 값이 바뀔 때
  (e: 'applied', value: number): void; // 전역 적용 완료
  (e: 'reset'): void; // 초기화 누를 때
}>();

// 전역 폰트 컨트롤
const { init, get, set, DEFAULT_PX } = useFontSize();

// 미리보기 전용 상태
const previewPx = ref<number>(DEFAULT_PX);

// 초기값: 현재 전역값을 읽어 미리보기로 세팅
onMounted(() => {
  init(); // (한 번만 불러도 안전) 저장된 전역값 적용
  previewPx.value = get();
});

// 헬퍼
const clamp = (n: number) => Math.min(props.max, Math.max(props.min, n));

function previewInc() {
  previewPx.value = clamp(previewPx.value + props.step);
  emit('changed', previewPx.value);
}
function previewDec() {
  previewPx.value = clamp(previewPx.value - props.step);
  emit('changed', previewPx.value);
}
function resetPreview() {
  previewPx.value = DEFAULT_PX;
  emit('reset');
}
// ✅ “이 크기로 설정” — 전역 저장 + 즉시 적용
function applyPreviewToGlobal() {
  set(previewPx.value);
  emit('applied', previewPx.value);
}

// 외부에서 필요하면 미리보기 값을 읽게 노출 (선택)
defineExpose({ previewPx });
</script>
