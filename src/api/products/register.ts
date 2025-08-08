import axios from 'axios';
import api from '@/api';

export const fetchReservedSlots = async (branchId: number) => {
  console.log('Fetching reserved slots for branch:', branchId);
  const res = await api.get(`/api/bookings/${branchId}/reserved-slots`);
  console.log('Reserved slots fetched:', res.data);
  return res.data;
};

interface BookingRequest {
  branchId: number;
  finPrdtCode: string;
  date: string;
  time: string;
}

export async function postBooking(data: BookingRequest) {
  const response = await api.post(`/api/bookings`, data);
  return response.data;
}

// guno: sms 서비스에서 사용해야하는 바디 형식 정의
export interface SmsData {
  phoneNumber: string; // 수신자 전화번호 - 추후 프론트에서 보낼지, 백에서 확인할지 결정
  // 현재는 프론트에서 하드코딩으로 보내도록 구현

  productName: string;
  branchName: string;
  reservationDate: string;
  reservationTime: string;
}

// guno: SMS API 함수들
export const smsApi = {
  // SMS 테스트 API
  async test() {
    const response = await api.get('/api/sms/test');
    return response.data;
  },

  // SMS 전송 API
  async send(smsData: SmsData) {
    const response = await api.post('/api/sms/send', smsData);
    return response.data;
  },
};
