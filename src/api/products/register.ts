import api from '@/api';

export interface Reserved {
  [date: string]: string[];
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

export const api_data: { reserved_slots: Reserved } = {
  reserved_slots: {
    '2025-07-30': ['10:00', '11:30', '14:00'],
    '2025-07-31': ['09:30'],
    '2025-08-03': ['10:00', '10:30', '11:00', '15:30'],
  },
};

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
