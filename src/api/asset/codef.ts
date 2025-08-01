import api from '@/api';

// CODEF 계좌 연동 요청 데이터 타입
export interface CodefAccountRequest {
  accountList: CodefAccount[];
}

export interface CodefAccount {
  countryCode: string;
  businessType: string;
  clientType: string;
  organization: string;
  loginType: string;
  password: string;
  id: string;
  birthday?: string;
}

export const codefApi = {
  async connect(accountData: CodefAccountRequest) {
    const response = await api.post('/api/codef/connected-id', accountData);
    return response.data;
  },
};
