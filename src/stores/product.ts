import { defineStore } from 'pinia';

// 상품 타입 정의
interface Product {
  fin_prdt_cd: string;
  fin_prdt_nm: string;
  prdt_feature: string;
  optionList?: any[];
  optionListList?: any[];
  type?: string;
  score?: number;
}

interface RecommendItem {
  fin_prdt_cd: string;
  score: number;
}

interface ProductState {
  allProducts: {
    timeDeposits: Product[];
    savingDeposits: Product[];
    mortgageLoan: Product[];
  };
}

export const useProductStore = defineStore('product', {
  state: (): ProductState => ({
    allProducts: {
      timeDeposits: [],
      savingDeposits: [],
      mortgageLoan: [],
    },
  }),

  getters: {
    flatProductList: (state): Product[] => {
      const flat: Product[] = [];

      const appendType = (list: Product[], type: string) => {
        list.forEach((p) => flat.push({ ...p, type }));
      };

      appendType(state.allProducts.timeDeposits, 'timeDeposit');
      appendType(state.allProducts.savingDeposits, 'savingDeposit');
      appendType(state.allProducts.mortgageLoan, 'mortgageLoan');

      return flat;
    },

    getProductsByRecommendIds:
      (state) =>
      (recommendList: RecommendItem[]): Product[] => {
        return recommendList
          .map(({ fin_prdt_cd, score }) => {
            const product = state.flatProductList.find(
              (p) => p.fin_prdt_cd === fin_prdt_cd
            );
            return product ? { ...product, score } : null;
          })
          .filter((item): item is Product => item !== null)
          .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
      },
  },

  actions: {
    setAllProducts(data: {
      timeDeposits: Product[];
      savingDeposits: Product[];
      mortgageLoan: Product[];
    }) {
      this.allProducts = data;
    },
  },
});
