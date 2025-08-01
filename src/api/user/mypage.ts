import api from '@/api';

export interface AssetStatusItem {
  assetCategoryCode: string;
  amount: number;
}

export interface MyPageUserInfo {
  email: string;
  userName: string;
  assetStatus: AssetStatusItem[];
}

export interface BookingInfo {
  bookingId: string;
  branchId: number;
  finPrdtCode: string;
  date: number; // timestamp
  time: string;
  docInfo: {
    requiredDocuments: string[];
  };
}

export interface MyPageResponse {
  userInfo: MyPageUserInfo;
  bookingInfo: BookingInfo[];
}

export const mypageApi = {
  async getMyPageData(): Promise<MyPageResponse> {
    const response = await api.get('/api/user/mypage');
    return response.data;
  },
};