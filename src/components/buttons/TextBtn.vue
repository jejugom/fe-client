<template>
  <button
    :class="[
      'font-semibold active:scale-102 active:opacity-90',
      color === 'surface' && 'text-surface-400',
      color === 'primary' && 'text-primary-300',
      size === 'medium' && 'text-lg',
      size === 'small' && 'text-base',
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
  size?: 'small' | 'medium';
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

function onClick() {
  emit('click');
}
</script>
