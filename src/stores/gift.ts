import { defineStore } from 'pinia';
import type {
  Asset,
  Beneficiary,
  DistributedAsset,
} from '@/types/gift/inheritance';
import type { PersistenceOptions } from 'pinia-plugin-persistedstate';

export const useGiftStore = defineStore('gift', {
  state: () => ({
    allAssets: new Map<string, Asset[]>() as Map<string, Asset[]>,
    beneficiaries: [] as Beneficiary[],
    distributedAssets: [] as DistributedAsset[],
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
    setGiftData(data: { distributedAssets: DistributedAsset[] }) {
      this.distributedAssets = data.distributedAssets;
    },
    clearData() {
      this.allAssets = new Map();
      this.beneficiaries = [];
      this.distributedAssets = [];
    },
  },

  persist: {
    // persist 속성에 타입 명시
    storage: localStorage,
    key: 'gift-state',
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
  } as PersistenceOptions,
});
