import type { set } from 'date-fns';
import { defineStore } from 'pinia';

export const useRegisterStore = defineStore('register', {
  state: () => ({
    productName: '',
    finPrdtCode: '',
    branchId: 0,
    branch: '',
    date: '',
    time: '',
    reservedSlots: {} as Record<string, string[]>,
  }),
  actions: {
    setProductName(name: string) {
      this.productName = name;
    },
    setBranchId(id: number) {
      this.branchId = id;
    },
    setBranch(branchName: string) {
      this.branch = branchName;
    },
    setDate(date: string) {
      this.date = date;
    },
    setTime(time: string) {
      this.time = time;
    },
    setReservedSlots(slots: Record<string, string[]>) {
      this.reservedSlots = slots;
    },
    setFinPrdtCode(code: string) {
      this.finPrdtCode = code;
    },
    getSummary() {
      return {
        branchId: this.branchId,
        finPrdtCode: this.finPrdtCode,
        date: this.date,
        time: this.time,
      };
    },
  },
});
