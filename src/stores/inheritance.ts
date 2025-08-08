import { defineStore, type StateTree } from 'pinia';
import type {
  Asset,
  Beneficiary,
  DistributedAsset,
  RecipientSummary,
} from '@/types/gift/inheritance';
import type { PersistenceOptions } from 'pinia-plugin-persistedstate';

export const useInheritanceStore = defineStore('inheritance', {
  state: () => ({
    allAssets: new Map<string, Asset[]>(),
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
    // persist 속성에 타입 명시
    storage: localStorage,
    key: 'inheritance-state', // 키를 'inheritance-state'로 변경하여 다른 스토어와 분리 // 키를 'inheritance-state'로 변경하여 다른 스토어와 분리
    paths: [
      'allAssets',
      'beneficiaries',
      'distributedAssets',
      'recipientSummaries',
      'totalGiftTax',
    ], // additionalWillContent 제외
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
        if (data?.allAssets) {
          data.allAssets = new Map<string, Asset[]>(data.allAssets);
        }
        return data as StateTree;
      },
    },
  } satisfies PersistenceOptions, // 여기에 타입 캐스팅 추가
});
