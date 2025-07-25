<template>
  <div
    :class="[
      'flex h-30 w-full items-center justify-start gap-6 rounded-lg px-8 py-4',
      color === 'primary' && 'stroke-primary bg-primary-100',
      color === 'secondary' && 'stroke-secondary bg-secondary-100',
      $attrs.class,
    ]"
    v-bind="$attrs"
    @click="onClick"
  >
    <!-- 아이콘 부분 -->
    <div class="flex h-16 w-16 items-center justify-center">
      <slot name="icon" />
    </div>
    <!-- 글자 부분 -->
    <div class="text-primary-300 flex flex-col gap-1">
      <div>{{ content1 }}</div>
      <div class="text-primary-500 text-2xl font-bold">{{ title }}</div>
      <div>{{ content2 }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
