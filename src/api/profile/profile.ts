import api from '@/api';

export interface UserProfile {
  email: string;
  userName: string;
  userPhone: string;
  birth: string;
}

export interface UpdateUserProfileRequest {
  userName?: string;
  userPhone?: string;
  birth?: string;
}

export interface BookingItem {
  id: string;
  date: string;
  time: string;
  bank_name: string | number; // 지점명 또는 branchId
  prdt_name: string; // 상품명 또는 finPrdtCode
  branchId?: number; // 백엔드에서 오는 지점 ID (선택적)
  finPrdtCode?: string; // 백엔드에서 오는 상품 코드 (선택적)
}

export interface ProfileData {
  user_info: {
    name: string;
    asset: number;
  };
  booking: {
    gift_booking: BookingItem;
    prdt_booking: BookingItem;
  };
  asset_info: {
    total: number;
    real_estate: number;
    deposit: number;
    cash: number;
    stock_fund: number;
    business_equity: number;
    etc: number;
  };
}

// 사용자 프로필 관리 API 함수들
export const profileApi = {
  /**
   * 사용자 프로필 정보 조회
   * @returns 사용자 프로필 정보
   */
  async getUserProfile(): Promise<UserProfile> {
    const response = await api.get('/api/user/me');
    // console.log('User profile fetched:', response.data);
    return response.data;
  },

  /**
   * 사용자 프로필 정보 수정
   * @param data 수정할 프로필 정보
   */
  async updateUserProfile(data: UpdateUserProfileRequest): Promise<void> {
    await api.patch('/api/user/me', data);
  },
};
