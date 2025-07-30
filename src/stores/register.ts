import { defineStore } from 'pinia';

interface RegisterState {
  productName: string;
  branch: string;
  date: string;
  time: string;
}

export const useRegisterStore = defineStore('register', {
  state: (): RegisterState => ({
    productName: '',
    branch: '',
    date: '',
    time: '',
  }),

  actions: {
    setProductName(name: string) {
      this.productName = name;
    },
    setBranch(branch: string) {
      this.branch = branch;
    },
    setDate(date: string) {
      this.date = date;
    },
    setTime(time: string) {
      this.time = time;
    },
    reset() {
      this.productName = '';
      this.branch = '';
      this.date = '';
      this.time = '';
    },
    getSummary() {
      return {
        상품명: this.productName,
        지점: this.branch,
        날짜: this.date,
        시각: this.time,
      };
    },
  },
});
