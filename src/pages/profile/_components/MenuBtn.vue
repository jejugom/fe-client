<template>
  <div class="flex w-full items-center justify-between">
    <!-- 기존 TextBtn 재사용 -->
    <TextBtn
      color="surface"
      :label="label"
      size="medium"
      :disabled="disabled"
      @click="$emit('click')"
      class="flex-1 text-left"
    />

    <!-- trailingArrow 옵션이 true일 때만 표시 -->
    <img
      :src="ArrowIcon"
      alt=""
      class="ml-2 h-4 w-4 shrink-0"
      @click="$emit('click')"
    />
  </div>
</template>

<script setup lang="ts">
import TextBtn from '@/components/buttons/TextBtn.vue';
import ArrowIcon from '@/assets/icons/ArrowAfter.svg';

defineProps<{
  label: string;
  color?: 'primary' | 'secondary' | 'surface';
  size?: 'small' | 'medium' | 'large';
  trailingArrow?: boolean;
  disabled?: boolean;
}>();

defineEmits<{ (e: 'click'): void }>();
</script>
