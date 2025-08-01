import api from '@/api';

export interface UserSummary {
  name: string;
  asset: number;
}

export interface RecommendedProduct {
  fin_prdt_cd: string;
  fin_prdt_nm: string;
  prdt_feature: string;
  intr_rate: number;
  intr_rate2: number;
}

export interface HomeData {
  userSummary: UserSummary;
  recommandTop3: RecommendedProduct[];
}

export const fetchHomeData = async (): Promise<HomeData> => {
  const response = await api.get('/api/home');
  console.log('Home data fetched:', response.data);
  return response.data;
};
