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
  bank_name: string;
  prdt_name: string;
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

export const profileApi = {
  async getUserProfile(): Promise<UserProfile> {
    const response = await api.get('/api/user/me');
    console.log('User profile fetched:', response.data);
    return response.data;
  },

  async updateUserProfile(data: UpdateUserProfileRequest): Promise<void> {
    await api.patch('/api/user/me', data);
  },
};
