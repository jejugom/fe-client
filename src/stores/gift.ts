import { defineStore, type StateTree } from 'pinia';
import type {
  Asset,
  Beneficiary,
  DistributedAsset,
} from '@/types/gift/inheritance'; // 필요한 타입만 남겨둠
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
    key: 'gift-state',
    storage: localStorage,
    serializer: {
      serialize: (state: StateTree): string => {
        const s = state as any;
        const allAssetsArray = Array.from(
          (s.allAssets as Map<string, Asset[]>).entries()
        );
        return JSON.stringify({ ...s, allAssets: allAssetsArray });
      },
      deserialize: (str: string): StateTree => {
        const data = JSON.parse(str);
        if (data?.allAssets)
          data.allAssets = new Map<string, Asset[]>(data.allAssets);
        return data as StateTree;
      },
    },
  } satisfies PersistenceOptions,
});
