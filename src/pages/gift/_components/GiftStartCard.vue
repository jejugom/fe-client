<template>
  <div class="card-design overflow-hidden py-8">
    <div class="mb-4 flex items-center gap-4">
      <div
        class="flex h-20 w-20 items-center justify-center rounded-lg bg-gradient-to-br"
      >
        <img :src="icon" :alt="`${title} 아이콘`" class="h-20 w-20" />
      </div>
      <div class="flex-1">
        <p class="text-primary-500 mb-2 text-2xl font-bold">{{ title }}</p>
        <p>
          {{ description }}
        </p>
      </div>
    </div>

    <div class="space-y-3">
      <Btn
        v-for="(btn, idx) in buttons"
        :key="idx"
        :color="btn.color"
        :label="btn.label"
        :size="btn.size || 'large'"
        @click="btn.onClick"
        class="w-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Btn from '@/components/buttons/Btn.vue';

interface ButtonProps {
  label: string;
  color: 'primary' | 'secondary' | 'secondary-stroke' | 'surface' | undefined;
  size?: 'small' | 'medium' | 'large' | 'square';
  onClick: () => void;
}

defineProps<{
  icon: string;
  title: string;
  description: string;
  buttons: ButtonProps[];
}>();
</script>
