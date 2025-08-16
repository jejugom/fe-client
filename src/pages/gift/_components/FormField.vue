<template>
  <div class="form-field">
    <label class="text-primary-500 mb-1 text-base font-semibold">
      {{ label }}
    </label>
    <p v-if="description" class="text-primary-500 mb-1 text-base">
      {{ description }}
    </p>

    <slot />

    <p v-if="error" class="mt-1 text-xs text-red-500">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  description?: string;
  error?: string;
}

// 기본값 설정
withDefaults(defineProps<Props>(), {
  description: '',
  error: '',
});
</script>
