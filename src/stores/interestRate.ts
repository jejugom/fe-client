import { defineStore } from 'pinia';

interface InterestRate {
  month: string;
  rate: number;
}

export const useGraphStore = defineStore('graph', {
  state: () => ({
    interestRate: [
      // { month: '2020-03-17', rate: 0.75 },
      // { month: '2020-05-28', rate: 0.5 },
      // { month: '2021-08-26', rate: 0.75 },
      // { month: '2021-11-25', rate: 1.0 },
      { month: '2022-01-14', rate: 1.25 },
      { month: '2022-04-14', rate: 1.5 },
      { month: '2022-05-26', rate: 1.75 },
      { month: '2022-07-13', rate: 2.25 },
      { month: '2022-08-25', rate: 2.5 },
      { month: '2022-10-12', rate: 3.0 },
      { month: '2022-11-24', rate: 3.25 },
      { month: '2023-01-13', rate: 3.5 },
      { month: '2024-10-11', rate: 3.25 },
      { month: '2024-11-28', rate: 3.0 },
      { month: '2025-02-25', rate: 2.75 },
      { month: '2025-05-29', rate: 2.5 },
    ] as InterestRate[],
  }),
});
