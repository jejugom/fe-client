import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false);

  function startLoading() {
    isLoading.value = true;
  }

  function endLoading() {
    isLoading.value = false;
  }

  return { isLoading, startLoading, endLoading };
});
