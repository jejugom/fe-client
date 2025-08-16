import api from '@/api';
import type { Quiz } from '@/types/event/quiz.d';

// 랜덤 퀴즈 7개 조회
export async function getQuiz(): Promise<Quiz[]> {
  const response = await api.get<any[]>('/api/event/quiz');
  return response.data.map((quiz) => {
    const choices =
      typeof quiz.choices === 'string'
        ? JSON.parse(quiz.choices)
        : quiz.choices;
    return { ...quiz, choices };
  });
}
