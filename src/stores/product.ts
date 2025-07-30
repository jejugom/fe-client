import { defineStore } from 'pinia';
import type { ProductDetail } from '@/api/products/productDetail';

interface RecommendItem {
  fin_prdt_cd: string;
  score: number;
}

interface ProductState {
  allProducts: {
    timeDeposits: ProductDetail[];
    savingDeposits: ProductDetail[];
    mortgageLoan: ProductDetail[];
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
    flatProductList: (state): ProductDetail[] => {
      return [
        ...state.allProducts.timeDeposits,
        ...state.allProducts.savingDeposits,
        ...state.allProducts.mortgageLoan,
      ];
    },

    getProductsByRecommendIds:
      (state) =>
      (recommendList: RecommendItem[]): ProductDetail[] => {
        return recommendList
          .map(({ fin_prdt_cd, score }) => {
            const product = state.allProducts.timeDeposits
              .concat(state.allProducts.savingDeposits)
              .concat(state.allProducts.mortgageLoan)
              .find((p) => p.fin_prdt_cd === fin_prdt_cd);
            return product ? { ...product, score } : null;
          })
          .filter((item): item is ProductDetail & { score: number } => !!item)
          .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
      },
  },

  actions: {
    setAllProducts(data: {
      timeDeposits: ProductDetail[];
      savingDeposits: ProductDetail[];
      mortgageLoan: ProductDetail[];
    }) {
      this.allProducts = data;
    },
  },
});
