import api from '@/api';

// 투자성향 질문 답변 데이터 타입
export interface PreferencesRequest {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
}

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
