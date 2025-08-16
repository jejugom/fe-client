import api from '@/api';

// 예약 상세 정보 조회
export async function fetchReservedDetail(identifier: string) {
  // console.log('Fetching reserved detail for booking code:', identifier);
  const res = await api.get(`/api/bookings/detail/${identifier}`);
  // console.log('Reserved detail fetched:', res.data);
  return res.data;
}
