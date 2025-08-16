import api from '@/api';

// FAQ 목록 조회 (내용 제외)
export async function getFaqList() {
  return api.get('/api/faq/list');
}

// FAQ 전체 상세 조회 (내용 포함)
export async function getAllFaqs() {
  return api.get('/api/faq/all');
}

// 특정 FAQ 상세 조회
export async function getFaqById(faqId: number) {
  return api.get(`/api/faq/${faqId}`);
}

// 특정 FAQ 일부 업데이트
export async function updateFaqPartial(
  faqId: number,
  updates: Record<string, any>
) {
  return api.patch(`/api/faq/${faqId}`, updates);
}
