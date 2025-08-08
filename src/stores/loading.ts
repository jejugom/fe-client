import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: false,
    hasError: false,
  }),
  actions: {
    startLoading() {
      this.isLoading = true;
      this.hasError = false; // 로딩 시작 시 에러 상태 초기화
    },
    stopLoading() {
      this.isLoading = false;
    },
    setError(hasError: boolean) {
      this.hasError = hasError;
    },
  },
});