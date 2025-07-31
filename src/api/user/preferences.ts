import api from '@/api';

// 투자성향 질문 답변 데이터 타입
export interface PreferencesRequest {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
}

export const preferencesApi = {
  async submit(preferences: PreferencesRequest) {
    const response = await api.post('/api/preference', preferences);
    return response.data;
  },
};
