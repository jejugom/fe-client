<template>
  <div
    class="border-b-surface-200 fixed top-[calc(64px)] left-1/2 z-20 box-border w-full max-w-[600px] -translate-x-1/2 border-b bg-white px-5 pt-4"
  >
    <div class="scrollbar-hide flex overflow-x-auto">
      <div class="flex gap-2">
        <TabBtn
          v-for="tab in tabs"
          :key="tab"
          :label="tab"
          :color="selectedTab === tab ? 'primary' : 'surface'"
          @click="selectTab(tab)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import TabBtn from './TabBtn.vue';

defineProps<{
  tabs: string[];
  selectedTab: string;
}>();

const emit = defineEmits<{
  (e: 'update:selectedTab', tab: string): void;
}>();

function selectTab(tab: string) {
  emit('update:selectedTab', tab);
}
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none; /* IE/Edge */
  scrollbar-width: none; /* Firefox */
}
.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome/Safari/Webkit */
}
</style>
