<template>
  <template v-if="type === 'type1'">
    <div class="flex gap-5 text-base font-semibold">
      <button
        class="btn-pressed bg-secondary-100 text-secondary-500 h-10.5 w-33 rounded-lg transition-colors duration-300"
        @click="onClick1"
      >
        {{ label1 }}
      </button>
      <button
        class="btn-pressed bg-primary-100 text-primary-500 h-10.5 w-33 rounded-lg transition-colors duration-300"
        @click="onClick2"
      >
        {{ label2 }}
      </button>
    </div>
  </template>

  <template v-else-if="type === 'type2'">
    <div class="flex gap-2 text-lg font-semibold">
      <template v-if="label1">
        <Btn color="surface" :label="label1" size="large" @click="onClick1" />
      </template>
      <template v-if="label2">
        <Btn color="primary" :label="label2" size="large" @click="onClick2" />
      </template>
    </div>
  </template>
</template>

<script setup lang="ts">
import Btn from '@/components/buttons/Btn.vue';

defineProps<{
  label1?: string;
  label2?: string;
  type?: 'type1' | 'type2';
  onClick1?: () => void;
  onClick2?: () => void;
}>();
</script>
