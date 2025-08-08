<template>
  <button
    :class="[
      'btn-pressed rounded-lg font-semibold',
      color === 'primary' && 'bg-primary-100 text-primary-500 stroke-primary',
      color === 'secondary' &&
        'bg-secondary-100 text-secondary-500 stroke-secondary',
      color === 'surface' && 'text-surface-500 stroke-surface bg-white',
      size === 'small' && 'h-8 w-20 text-sm',
      size === 'medium' && 'h-15 w-72 text-lg',
      size === 'large' && 'h-15 w-full text-lg',
      size === 'square' && 'h-13 w-13 text-sm',
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
  color?: 'primary' | 'secondary' | 'surface';
  size?: 'small' | 'medium' | 'large' | 'square';
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const onClick = () => {
  emit('click');
};
</script>
