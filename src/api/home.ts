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

/**
 * 홈페이지 데이터 조회 (사용자 요약 정보 및 추천 상품)
 * @returns 홈페이지에 표시할 데이터
 */
export async function fetchHomeData(): Promise<HomeData> {
  const response = await api.get('/api/home');
  // console.log('Home data fetched:', response.data);
  return response.data;
}
