<template>
  <div class="flex flex-col">
    <div class="flex gap-2">
      <TabBtn
        v-for="tab in tabs"
        :key="tab"
        :label="tab"
        :color="selectedTab === tab ? 'primary' : 'surface'"
        @click="selectTab(tab)"
      />
    </div>
    <div class="bg-surface-200 h-0.5 w-full" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import TabBtn from './TabBtn.vue';

const props = defineProps<{
  tabs: string[];
  selectedTab: string;
}>();

const emit = defineEmits<{
  (e: 'update:selectedTab', tab: string): void;
}>();

const selectTab = (tab: string) => {
  emit('update:selectedTab', tab);
};
</script>
