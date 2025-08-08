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
