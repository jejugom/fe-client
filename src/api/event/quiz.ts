import api from '@/api';
import type { Quiz } from '@/types/event/quiz.d';

export const getQuiz = async (): Promise<Quiz[]> => {
  const response = await api.get<any[]>('/api/event/quiz');
  return response.data.map((quiz) => {
    const choices = typeof quiz.choices === 'string' ? JSON.parse(quiz.choices) : quiz.choices;
    return { ...quiz, choices };
  });
};
