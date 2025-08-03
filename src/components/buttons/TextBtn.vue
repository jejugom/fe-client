<template>
  <button
    :class="[
      'font-semibold',
      color === 'surface' && 'text-surface-400',
      color === 'primary' && 'text-primary-300',
      size === 'medium' && 'text-lg',
      size === 'small' && '',
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

const onClick = () => {
  emit('click');
};
</script>
