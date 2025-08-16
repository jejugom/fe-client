import api from '@/api';
import type { PreferencesRequest } from '@/types/user/preferences';

// 투자성향 질문 관련 API 함수들
export const preferencesApi = {
  /**
   * 투자성향 질문 답변 제출
   * @param preferences 5개 질문에 대한 답변 데이터
   * @returns 제출 결과
   */
  async submit(preferences: PreferencesRequest) {
    const response = await api.post('/api/preference', preferences);
    return response.data;
  },
};
