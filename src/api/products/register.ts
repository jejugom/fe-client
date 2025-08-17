import api from '@/api';
import type { BookingRequest, SmsData } from '@/types/products/register';

// 특정 지점 예약 정보 조회
export async function fetchReservedSlots(branchId: number) {
  // console.log('Fetching reserved slots for branch:', branchId);
  const res = await api.get(`/api/bookings/${branchId}/reserved-slots`);
  // console.log('Reserved slots fetched:', res.data);
  return res.data;
}

// 신규 예약 등록
export async function postBooking(data: BookingRequest) {
  const response = await api.post(`/api/bookings`, data);
  return response.data;
}

// SMS 관련 API
export const smsApi = {
  async test() {
    const response = await api.get('/api/sms/test');
    return response.data;
  },

  async send(smsData: SmsData) {
    const response = await api.post('/api/sms/send', smsData);
    return response.data;
  },
};
