<template>
  <div class="stroke-primary mb-16 flex flex-col gap-8 rounded-xl px-8 py-12">
    <div>
      <h2 class="text-primary-500 mb-3 text-center text-xl font-bold">
        {{ question.title }}
      </h2>
      <p class="text-surface-300 mb-5 text-center whitespace-pre-line">
        {{ question.description }}
      </p>
    </div>
    <div class="flex flex-col gap-3">
      <Btn
        v-for="(option, idx) in question.options"
        :key="idx"
        :label="option.label"
        :color="selectedValue === option.value ? 'secondary-stroke' : 'surface'"
        size="medium"
        class="w-full"
        @click="$emit('select', option.value)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Btn from '@/components/buttons/Btn.vue';

defineProps<{
  question: {
    title: string;
    description: string;
    options: { label: string; value: string }[];
  };
  selectedValue: string;
}>();

defineEmits<{
  (e: 'select', value: string): void;
}>();
</script>

<style scoped></style>
