import api from '@/api';

// FAQ 목록 조회 (내용 제외)
export const getFaqList = () => {
  return api.get('/api/faq/list');
};

// FAQ 전체 상세 조회 (내용 포함)
export const getAllFaqs = () => {
  return api.get('/api/faq/all');
};

// 특정 FAQ 상세 조회
export const getFaqById = (faqId: number) => {
  return api.get(`/api/faq/${faqId}`);
};

// 특정 FAQ 일부 업데이트
export const updateFaqPartial = (
  faqId: number,
  updates: Record<string, any>
) => {
  return api.patch(`/api/faq/${faqId}`, updates);
};

// 타입 정의 (FaqListDto 기준)
export interface Faq {
  faqId: number;
  category: '상속' | '증여';
  title: string;
  content: string;
}
