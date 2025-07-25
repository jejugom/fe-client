<template>
  <button
    :class="[
      'h-8 w-20 rounded-t-lg text-sm font-semibold transition-colors duration-200',
      color === 'primary' && 'bg-primary-100 text-primary-500',
      color === 'surface' &&
        'text-surface-500 border-surface-200 border border-b-0 bg-white',
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
