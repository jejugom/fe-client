<template>
  <button
    :class="[
      'rounded-lg font-semibold',
      transition && 'transition-colors duration-300',
      color === 'primary' && 'bg-primary-100 text-primary-500',
      color === 'secondary' && 'bg-secondary-100 text-secondary-500',
      color === 'secondary-stroke' &&
        'bg-secondary-100 text-secondary-500 border-secondary-300 border',
      color === 'surface' &&
        'text-surface-500 border-surface-200 border bg-white',
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
  color?: 'primary' | 'secondary' | 'secondary-stroke' | 'surface';
  size?: 'small' | 'medium' | 'large' | 'square';
  transition?: boolean;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const onClick = () => {
  emit('click');
};
</script>
