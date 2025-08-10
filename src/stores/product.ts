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

export interface TrustProduct {
  finPrdtCd: string;
  finPrdtNm: string;
  prdtFeature: string;
  finPrdtCategory: string; // "6"
  optionList?: any[];
}

export interface AllProducts {
  timeDeposits: TimeDepositProduct[];
  savingsDeposits: SavingDepositProduct[];
  mortgageLoan: MortgageLoanProduct[];
  goldProducts: GoldProduct[];
  fundProducts: FundProduct[];
  trustProducts: TrustProduct[];
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
      trustProducts: [] as TrustProduct[],
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
        | TrustProduct
      )[] = [
        ...this.allProducts.timeDeposits,
        ...this.allProducts.savingsDeposits,
        ...this.allProducts.mortgageLoan,
        ...this.allProducts.goldProducts,
        ...this.allProducts.fundProducts,
        ...this.allProducts.trustProducts,
      ];
      return all.find((p) => p.finPrdtCd === id);
    },
    getProductsByRecommendIds(recommendItems: CustomRecommendProduct[]) {
      console.log('🔍 getProductsByRecommendIds 호출됨');
      console.log('📋 추천 아이템들:', recommendItems);
      console.log('🏪 현재 스토어 상태:', this.allProducts);
      
      const recommendedProducts: (
        | TimeDepositProduct
        | SavingDepositProduct
        | MortgageLoanProduct
        | GoldProduct
        | FundProduct
        | TrustProduct
      )[] = [];
      
      recommendItems.forEach((item) => {
        console.log(`🔎 상품 코드 ${item.finPrdtCd} 검색 중...`);
        const product = this.getProductById(item.finPrdtCd);
        if (product) {
          console.log(`✅ 상품 찾음:`, product);
          recommendedProducts.push(product);
        } else {
          console.log(`❌ 상품 못찾음: ${item.finPrdtCd}`);
        }
      });
      
      console.log('📦 최종 추천 상품 목록:', recommendedProducts);
      return recommendedProducts;
    },
  },
});
