import { defineStore } from 'pinia';
import { runGiftTaxSimulation } from '@/api/gift/simulation';
import type {
  SimulationRequestDto,
  SimulationResponseDto,
  RecipientTaxDetailDto,
} from '@/types/gift/simulation';

interface SimulationState {
  totalGiftTax: number;
  recipientSummaries: RecipientTaxDetailDto[];
  taxSavingStrategies: string[];
}

export const useSimulationStore = defineStore('simulation', {
  state: (): SimulationState => ({
    totalGiftTax: 0,
    recipientSummaries: [],
    taxSavingStrategies: [],
  }),

  actions: {
    async simulateGiftTax(requestDto: SimulationRequestDto) {
      try {
        const response: SimulationResponseDto =
          await runGiftTaxSimulation(requestDto);

        this.totalGiftTax = response.totalEstimatedTax;
        this.recipientSummaries = response.recipientDetails;
        this.taxSavingStrategies = response.taxSavingStrategies;
      } catch (error) {
        console.error('증여세 시뮬레이션 실패:', error);
      }
    },

    clearSimulationData() {
      this.totalGiftTax = 0;
      this.recipientSummaries = [];
      this.taxSavingStrategies = [];
    },
  },
});
