interface UserSummary {
  name: string;
  asset: number;
}

interface RecommendedProduct {
  fin_prdt_cd: string;
  fin_prdt_nm: string;
  prdt_feature: string;
  intr_rate: number;
  intr_rate2: number;
}

interface HomeData {
  userSummary: UserSummary;
  recommandTop3: RecommendedProduct[];
}

export type { UserSummary, RecommendedProduct, HomeData };
