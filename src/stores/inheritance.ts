import { defineStore } from 'pinia';
import type {
  Asset,
  Beneficiary,
  DistributedAsset,
  RecipientSummary,
} from '@/types/gift/inheritance';

export const useInheritanceStore = defineStore('inheritance', {
  state: () => ({
    allAssets: new Map<string, Asset[]>() as Map<string, Asset[]>,
    beneficiaries: [] as Beneficiary[],
    distributedAssets: [] as DistributedAsset[],
    recipientSummaries: [] as RecipientSummary[],
    totalGiftTax: 0,
    additionalWillContent: '',
  }),

  actions: {
    setInitialData(data: {
      allAssets: Map<string, Asset[]>;
      beneficiaries: Beneficiary[];
    }) {
      this.allAssets = new Map(data.allAssets);
      this.beneficiaries = data.beneficiaries;
    },
    setAllAssets(assets: Map<string, Asset[]>) {
      this.allAssets = new Map(assets);
    },
    setInheritanceData(data: {
      distributedAssets: DistributedAsset[];
      recipientSummaries: RecipientSummary[];
      totalGiftTax: number;
    }) {
      this.distributedAssets = data.distributedAssets;
      this.recipientSummaries = data.recipientSummaries;
      this.totalGiftTax = data.totalGiftTax;
    },
    setAdditionalWillContent(content: string) {
      this.additionalWillContent = content;
    },
    clearData() {
      this.allAssets = new Map();
      this.beneficiaries = [];
      this.distributedAssets = [];
      this.recipientSummaries = [];
      this.totalGiftTax = 0;
      this.additionalWillContent = '';
    },
  },

  persist: {
    storage: localStorage,
    key: 'inheritance-state', // 키를 'inheritance-state'로 변경하여 다른 스토어와 분리
    serializer: {
      serialize: (state) => {
        const allAssetsArray = Array.from(state.allAssets.entries());
        return JSON.stringify({ ...state, allAssets: allAssetsArray });
      },
      deserialize: (str) => {
        const data = JSON.parse(str);
        if (data.allAssets) {
          data.allAssets = new Map(data.allAssets);
        }
        return data;
      },
    },
  },
});
