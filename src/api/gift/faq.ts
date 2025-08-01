// /api/faq
export interface Faq {
  faqId: number;
  category: '상' | '증';
  title: string;
}

export const api_data: Faq[] = [
  {
    faqId: 1,
    category: '상',
    title: '상속세는 어떤 세금인가요?',
  },
  {
    faqId: 2,
    category: '상',
    title: '상속재산에 추가로 포함되는 것이 있나요?',
  },
  {
    faqId: 3,
    category: '증',
    title: '증여세 신고는 어떻게 하나요?',
  },
  {
    faqId: 4,
    category: '증',
    title: '증여세 면제 한도는 얼마인가요?',
  },
  {
    faqId: 5,
    category: '상',
    title: '상속재산 평가 방법은 무엇인가요?',
  },
  {
    faqId: 6,
    category: '증',
    title: '증여세 신고 기한은 언제인가요?',
  },
];
