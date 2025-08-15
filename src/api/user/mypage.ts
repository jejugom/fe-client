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

// 마이페이지 관련 API 함수들
export const mypageApi = {
  /**
   * 마이페이지 데이터 조회 (사용자 정보, 자산 현황, 예약 내역)
   * @returns 마이페이지 전체 데이터
   */
  async getMyPageData(): Promise<MyPageResponse> {
    const response = await api.get('/api/user/mypage');
    return response.data;
  },

  /**
   * 예약 정보 수정 (날짜, 시간)
   * @param bookingId 수정할 예약 ID
   * @param data 수정할 예약 정보
   */
  async updateBooking(bookingId: string, data: BookingUpdateRequest): Promise<void> {
    await api.patch(`/api/bookings/${bookingId}`, data);
  },

  /**
   * 예약 삭제
   * @param bookingId 삭제할 예약 ID
   */
  async deleteBooking(bookingId: string): Promise<void> {
    await api.delete(`/api/bookings/${bookingId}`);
  },

  async deleteMe(): Promise<void> {
    await api.delete('/api/user/me');
  },
};
