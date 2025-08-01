<template>
  <button
    :class="[
      // duration-200 유지, 검은 테두리 안보이도록 수정
      'h-8 w-20 rounded-t-lg border border-b-0 text-sm font-semibold transition-colors duration-200',
      color === 'primary' && 'bg-primary-300 border-transparent text-white',
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

const onClick = () => {
  emit('click');
};
</script>
