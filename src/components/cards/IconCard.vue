<template>
  <div
    :class="[
      'btn-pressed relative flex h-30 w-full items-center justify-start gap-6 rounded-lg p-4',
      color === 'primary' && 'stroke-primary bg-primary-100',
      color === 'secondary' && 'stroke-secondary bg-secondary-100',
      $attrs.class,
    ]"
    v-bind="$attrs"
    @click="onClick"
  >
    <!-- 우측 상단 고정 아이콘 -->
    <TextBtn
      color="surface"
      label="하러가기 ➜"
      size="small"
      class="absolute top-4 right-4"
    />

    <!-- 아이콘 영역 -->
    <div class="flex h-16 w-16 items-center justify-center">
      <slot name="icon" />
    </div>

    <!-- 텍스트 -->
    <div class="text-primary-500 flex flex-col gap-1 text-sm">
      <div>{{ content1 }}</div>
      <div class="text-primary-500 text-2xl font-bold">{{ title }}</div>
      <div>{{ content2 }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import ArrowIcon from '@/assets/icons/Arrow45.svg';
import TextBtn from '../buttons/TextBtn.vue';

defineOptions({ inheritAttrs: false });
defineProps<{
  title?: string;
  content1?: string;
  content2?: string;
  color?: 'primary' | 'secondary';
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();
const onClick = () => {
  emit('click');
};
</script>
