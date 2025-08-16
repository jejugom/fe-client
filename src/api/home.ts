import api from '@/api';
import type { HomeData } from '@/types/home';

/**
 * 홈페이지 데이터 조회 (사용자 요약 정보 및 추천 상품)
 * @returns 홈페이지에 표시할 데이터
 */
export async function fetchHomeData(): Promise<HomeData> {
  const response = await api.get('/api/home');
  // console.log('Home data fetched:', response.data);
  return response.data;
}
