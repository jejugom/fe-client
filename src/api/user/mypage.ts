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
  assetPercentile: number;
}

export interface BookingUpdateRequest {
  date: string;
  time: string;
}

export const mypageApi = {
  async getMyPageData(): Promise<MyPageResponse> {
    const response = await api.get('/api/user/mypage');
    return response.data;
  },

  async updateBooking(bookingId: string, data: BookingUpdateRequest): Promise<void> {
    const response = await api.patch(`/api/bookings/${bookingId}`, data);
    return response.data;
  },

  async deleteBooking(bookingId: string): Promise<void> {
    const response = await api.delete(`/api/bookings/${bookingId}`);
    return response.data;
  },
};