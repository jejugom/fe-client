<template>
  <button
    :class="[
      'btn-pressed h-8 w-20 rounded-t-lg border border-b-0 text-sm font-semibold transition-colors duration-200',
      // 증여 페이지에서 사용, 노후 페이지에 영향 X (이미지는 중앙 정렬이 안 되어서 추가한 클래스)
      'flex items-center justify-center',
      color === 'primary' &&
        'bg-primary-100 text-primary-500 border-transparent',
      color === 'surface' && 'text-surface-500 border-surface-200 bg-white',
      $attrs.class,
    ]"
    v-bind="$attrs"
    @click="onClick"
    ><slot>{{ label }}</slot></button
  >
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});
defineProps<{
  label?: string;
  color?: 'primary' | 'surface';
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

function onClick() {
  emit('click');
}
</script>
