import { defineStore } from 'pinia';

// 각 상품 타입에 대한 인터페이스 정의
export interface TimeDepositProduct {
  finPrdtCd: string;
  finPrdtNm: string;
  prdtFeature: string;
  finPrdtCategory: string; // "1"
  optionList: {
    saveTrm: string | null;
    intrRate: number;
    intrRate2: number;
  }[];
}

export interface SavingDepositProduct {
  finPrdtCd: string;
  finPrdtNm: string;
  prdtFeature: string;
  finPrdtCategory: string; // "2"
  optionList: {
    saveTrm: string;
    intrRate: number;
    intrRate2: number;
  }[];
}

export interface MortgageLoanProduct {
  finPrdtCd: string;
  finPrdtNm: string;
  prdtFeature: string;
  finPrdtCategory: string; // "3"
  optionList: {
    mrtgTypeNm: string;
    rpayTypeNm: string;
    lendRateTypeNm: string;
    lendRateMin: string;
    lendRateMax: string;
  }[];
}

export interface GoldProduct {
  finPrdtCd: string;
  finPrdtNm: string;
  prdtFeature: string;
  finPrdtCategory: string; // "4"
}

export interface FundProduct {
  finPrdtCd: string;
  finPrdtNm: string;
  prdtFeature: string;
  finPrdtCategory: string; // "5"
  optionList: {
    rate3mon: string;
    riskGrade: string;
    priceStd: string;
  }[];
}

export interface AllProducts {
  timeDeposits: TimeDepositProduct[];
  savingsDeposits: SavingDepositProduct[];
  mortgageLoan: MortgageLoanProduct[];
  goldProducts: GoldProduct[];
  fundProducts: FundProduct[];
}

// 추천 상품 인터페이스
export interface CustomRecommendProduct {
  finPrdtCd: string;
  score: string;
}

export const useProductStore = defineStore('product', {
  state: () => ({
    allProducts: {
      timeDeposits: [] as TimeDepositProduct[],
      savingsDeposits: [] as SavingDepositProduct[],
      mortgageLoan: [] as MortgageLoanProduct[],
      goldProducts: [] as GoldProduct[],
      fundProducts: [] as FundProduct[],
    } as AllProducts,
  }),
  actions: {
    setAllProducts(products: AllProducts) {
      this.allProducts = products;
    },
    getProductById(id: string) {
      // 모든 카테고리의 상품을 순회하며 ID 일치 여부 확인
      const all: (
        | TimeDepositProduct
        | SavingDepositProduct
        | MortgageLoanProduct
        | GoldProduct
        | FundProduct
      )[] = [
        ...this.allProducts.timeDeposits,
        ...this.allProducts.savingsDeposits,
        ...this.allProducts.mortgageLoan,
        ...this.allProducts.goldProducts,
        ...this.allProducts.fundProducts,
      ];
      return all.find((p) => p.finPrdtCd === id);
    },
    getProductsByRecommendIds(recommendItems: CustomRecommendProduct[]) {
      const recommendedProducts: (
        | TimeDepositProduct
        | SavingDepositProduct
        | MortgageLoanProduct
        | GoldProduct
        | FundProduct
      )[] = [];
      recommendItems.forEach((item) => {
        const product = this.getProductById(item.finPrdtCd);
        if (product) {
          recommendedProducts.push(product);
        }
      });
      return recommendedProducts;
    },
  },
});
