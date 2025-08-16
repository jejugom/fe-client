import api from '@/api';
import type { ParsedApiResponse } from '@/types/nohoo/nohoo';

// 노후 메인페이지 조회
export async function fetchNohooData(): Promise<ParsedApiResponse> {
  const res = await api.get<ParsedApiResponse>(`/api/retirement`);
  // console.log('Nohoo data fetched:', res.data);
  return res.data;
}
