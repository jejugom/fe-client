import api from '@/api';
import type {
  UserProfile,
  UpdateUserProfileRequest,
} from '@/types/profile/profile';

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
