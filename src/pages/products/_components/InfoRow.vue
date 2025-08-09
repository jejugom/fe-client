<template>
  <div class="flex gap-4">
    <div class="text-primary-500 w-24 font-semibold">{{ label }}</div>
    <div>{{ value }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
}>();
</script>
