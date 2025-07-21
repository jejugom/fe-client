<template>
  <div class="flex gap-5 text-sm font-semibold">
    <button
      class="bg-secondary-100 text-secondary-500 h-10.5 w-33 rounded-lg"
      @click="onClick1"
    >
      {{ label1 }}
    </button>
    <button
      class="bg-primary-100 text-primary-500 h-10.5 w-33 rounded-lg"
      @click="onClick2"
    >
      {{ label2 }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label1?: string;
  label2?: string;
  onClick1?: () => void;
  onClick2?: () => void;
}>();
</script>
